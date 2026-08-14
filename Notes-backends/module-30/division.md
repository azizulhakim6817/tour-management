## division---------------------------

# 1. slug---> division/dhaka-division

# 2. division/model.ts--------------------------

---> slug: { type: String, unique: true },

# 3. division.service.ts---------------------------

```js
//* slug create and setup-----------------------
const baseSlug = payload.name?.toLocaleLowerCase().split(" ").join("-");
let slug = `${baseSlug}-division`;

let counter = 0;
while (await DivisionModel.exists({ slug })) {
  slug = `${slug}-${counter++}`;
}

payload.slug = slug;
```

# 3. updateDivision--------------------------

```js
//* slug create and setup-----------------------
const baseSlug = payload.name?.toLocaleLowerCase().split(" ").join("-");
let slug = `${baseSlug}-division`;
```

let counter = 0;
while (await DivisionModel.exists({ slug })) {
slug = `${slug}-${counter++}`;
}

payload.slug = slug;

```

```

# updateDivison ---> duplicate division check---------------------

```js
const duplicateDivision = await DivisionModel.findOne({
name: payload.name as string,
_id: { $ne: id },
});
```

#
