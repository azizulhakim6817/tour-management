# Tour------------------------

1. tour.interface----------------------
   -> --> divition?: Types.ObjectId;
   ->

2. tour/model.ts--------------------------
   --> included?: string[];
   --> images?: string[];
   --> included: { type: [String], default: [] },
   --> divition: { type: Schema.Types.ObjectId },
   --> export const TourModel = model<ITour>("tours", tourSchema);

3. ***
   ->
