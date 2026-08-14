# select-------------------------------------------

1. Tour.find().slect("title")-----just title data show-------------------------
1. Tour.find().slect("-title")----without--title --> all show data-----------

```js
  {
    "_id": "6a5af317d0f243ec2868ea31",
     "title": "Rajshahi Heritage Tour"
      }
```

# postman ------------------------------------------

http://localhost:5000/api/v1/tour?selectfields=title
http://localhost:5000/api/v1/tour?selectfields=title

1. app/constents/tour.constent--------------------

```js
export const tourSearchAbleField = ["title", "description", "location"];
export const excludeField = ["searchTerm", "sort", "selectfields"];
```

```js

//* field-1 filtering--------------------------
const selectfields = query.selectfields || "";
//* field-2 filtering-(multi-field)-------------------------
//const selectfields = query.selectfields?.split(" ").join(" ") || "";

3. Tour.find().select(selectfields);
```
