# mongodb update data set-----------------------------

```js
await TourModel.updateMany({
  $or: [
    { tourType: { $type: "string" } },
    { division: { $type: "string" } },
    [
      {
        $set: {
          tourType: { $toObjectId: "$tourType" },
          division: { $toObjectId: "$division" },
        },
      },
    ],
  ],
});
```
