import assert from "node:assert/strict";
import {classifyWorkersAiError,extractExtraActivityScreenshot,parseExtraActivityVisionText,EXTRA_ACTIVITY_MODEL} from "../worker/strava/src/extra-activity-parser.mjs";

const fixture=`ACTIVITY: Outdoor Run
DATE: August 30, 2026
START: 3:37 PM
END: 5:03 PM
DURATION: 1:25:43
DISTANCE: 5.25 mi
PACE: 16:19/mi
ACTIVE_CALORIES: 584
TOTAL_CALORIES: 584
AVERAGE_HR: null
INCLINE: null`;
const parsed=parseExtraActivityVisionText(fixture);
assert.equal(parsed.candidate.sourceActivityName,"Outdoor Run");assert.equal(parsed.candidate.date,"2026-08-30");assert.equal(parsed.candidate.startTime,"15:37");assert.equal(parsed.candidate.endTime,"17:03");
assert.equal(parsed.candidate.durationSeconds,5143);assert.equal(parsed.candidate.distance,5.25);assert.equal(parsed.candidate.averagePaceSecondsPerMile,979);assert.equal(parsed.candidate.activeCalories,584);assert.equal(parsed.candidate.totalCalories,584);assert.equal(parsed.candidate.averageHeartRate,null);assert.equal(parsed.candidate.inclineResistance,null);assert.deepEqual(parsed.candidate.warnings,[]);assert.equal(parsed.reviewRequired,true);

const variant=parseExtraActivityVisionText("extra prose\n activity : Outdoor Run \n date: 2026-08-30\n duration: 1:25:43\n distance: 5.25 mi\n pace: 16’19”/mi\n active_calories: 1,234\n total_calories: 1,234\n average_hr: NOT_FOUND\n incline: null");
assert.equal(variant.candidate.averagePaceSecondsPerMile,979);assert.equal(variant.candidate.activeCalories,1234);assert.equal(variant.candidate.averageHeartRate,null);
const malformed=parseExtraActivityVisionText("ACTIVITY: Run\nDATE: nope\nSTART: 33:70\nDURATION: bad\nDISTANCE: many\nPACE: fast");
assert.equal(malformed.candidate.date,null);assert.equal(malformed.candidate.durationSeconds,null);assert(malformed.candidate.warnings.length>=4);assert.equal(malformed.extractionComplete,false);
const missing=parseExtraActivityVisionText("ACTIVITY: Outdoor Run\nDURATION: null");assert.equal(missing.candidate.distance,null);assert.equal(missing.extractionComplete,false);assert(missing.candidate.warnings.some(value=>/incomplete/i.test(value)));
const duplicate=parseExtraActivityVisionText("ACTIVITY: Outdoor Run\nACTIVITY: Indoor Run\nDATE: 2026-08-30");assert.equal(duplicate.candidate.sourceActivityName,"Outdoor Run");assert.equal(duplicate.candidate.confidence.sourceActivityName,"LOW");
assert(parseExtraActivityVisionText(fixture.replace("END: 5:03 PM","END: 6:03 PM")).candidate.warnings.some(value=>/Start time/i.test(value)));
assert(parseExtraActivityVisionText(fixture.replace("PACE: 16:19/mi","PACE: 20:00/mi")).candidate.warnings.some(value=>/pace conflict/i.test(value)));
assert(parseExtraActivityVisionText(fixture.replace("ACTIVE_CALORIES: 584","ACTIVE_CALORIES: 685")).candidate.warnings.some(value=>/greater than total/i.test(value)));

let request=null;
const jpeg="data:image/jpeg;base64,/9j/4AAQSkZJRg==";
const result=await extractExtraActivityScreenshot({env:{AI:{run:async(model,input)=>{request={model,input};return {response:fixture};}}},imageDataUrl:jpeg});
assert.equal(request.model,EXTRA_ACTIVITY_MODEL);assert.equal(request.input.image,jpeg,"image data URL must pass exactly once without double encoding");assert.equal("response_format" in request.input,false,"plain-text fallback must not request JSON Mode");assert.equal(result.candidate.distance,5.25);assert.equal(result.stored,false);assert.equal(result.extractionComplete,true);assert(result.literalFields.ACTIVITY==="Outdoor Run");
const incomplete=await extractExtraActivityScreenshot({env:{AI:{run:async()=>({response:"I could not read it."})}},imageDataUrl:jpeg});assert.equal(incomplete.extractionComplete,false);assert(incomplete.candidate.warnings.some(value=>/manually/i.test(value)));
await assert.rejects(()=>extractExtraActivityScreenshot({env:{AI:{run:async()=>{throw Object.assign(new Error("Request timeout"),{code:3007,status:408});}}},imageDataUrl:jpeg}),error=>error.code==="AI_TIMEOUT"&&/manual entry/.test(error.message));
await assert.rejects(()=>extractExtraActivityScreenshot({env:{},imageDataUrl:jpeg}),error=>error.code==="PARSER_UNAVAILABLE");
assert.deepEqual(classifyWorkersAiError(new Error("3030: Internal Server Error")),{code:"AI_PROVIDER_INTERNAL",status:502,diagnosticCategory:"MODEL_PROVIDER_INTERNAL"});
console.log("Extra activity Worker tests passed: labeled plain text, normalization, conflicts, incomplete review fallback, privacy contract, and safe provider errors.");
