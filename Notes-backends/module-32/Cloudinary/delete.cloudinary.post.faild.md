## delete Image From Cloudinary------------------------

npm install cloudinary@1.41.3
multer-storage-cloudinary@4.0.0
npm install --legacy-peer-deps

==> cloudinary : if any post image URL don't successfullt then it will be deleted!

```js
https://res.cloudinary.com/dlksmhtmq/image/upload/v1784887352/PH-Tour-Management/jhvyqfshq1m-1784887348156-ChatGPT-Image-Mar-2--2026--09-55-26-PM-png.png.png
```

1. app/config/cloudinary.config.ts---------------------

   ==> cloudinary : if any post image URL don't successfullt then it will be deleted!

```js
//!  delete image cloudinary=============================
//* If any image upload fails, all previously uploaded images will be deleted.
export const deleteImageFromCloudinary = async (url: string) => {
  try {
    const regex = /\/v\d+\/(.*?)\.(jpeg|jpg|png|gif|webp)$/i;
    const match = url.match(regex);

    if (match && match[1]) {
      const public_id = match[1];
      await cloudinary.uploader.destroy(public_id);
    }
  } catch (error: any) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Cloudinary image deletion faild!",
      error.message,
    );
  }
};
```

2. Middleware/globalErrorHandler.ts-------------------------------
   ==> cloudinary : if any post image URL don't successfullt then it will be deleted!

```js
  if (req.file) {
    await deleteImageFromCloudinary(req.file.path);
  }
  if (req.files && Array.isArray(req.files) && req.files.length) {
    const imageUrl = (req.files as Express.Multer.File[]).map(
      (file) => file.path,
    );

    await Promise.all(imageUrl.map((url) => deleteImageFromCloudinary(url)));
  }
```
