## Slug--->URL ---<dinamic create--------------------->

# 1. pre methode---> create--slug---------------------------------------

```js
divisionSchema.pre("save", async function () {
  const baseSlug = this.name.toLowerCase().trim().split(/\s+/).join("-");

  let slug = `${baseSlug}-division`;
  let counter = 1;

  while (await DivisionModel.exists({ slug })) {
    slug = `${baseSlug}-division-${counter}`;
    counter++;
  }

  this.slug = slug;
});
```

# 2. pre-methor--> update slug--------------------------------------

```js
divisionSchema.pre("findOneAndUpdate", async function () {
  const update = this.getUpdate() as Record<string, unknown>;

  if (!update.name) return;

  const baseSlug = (update.name as string)
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .join("-");

  let slug = `${baseSlug}-division`;
  let counter = 1;

  while (await DivisionModel.exists({ slug })) {
    slug = `${baseSlug}-division-${counter}`;
    counter++;
  }

  update.slug = slug;
  this.setUpdate(update);
});

```
