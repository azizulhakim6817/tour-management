# User Dashboard=================

```js
const now = new Date();

const sevenDaysAgo = new Date(now).setDate(now.getDate() - 7);
const thirtyDaysAgo = new Date(now).setDate(now.getDate() - 30);

//! get user stats---------------------
const getUserStats = async () => {
  const totalUserPromise = UserModel.countDocuments();

  const totalActiveUserPromise = UserModel.countDocuments({
    isActive: IsActive.ACTIVE,
  });

  const totalInActiveUserPromise = UserModel.countDocuments({
    isActive: IsActive.INACTIVE,
  });
  const totalBlockUserPromise = UserModel.countDocuments({
    isActive: IsActive.BLOCKED,
  });

  const newUserInLast7UserPromise = UserModel.countDocuments({
    createdAt: { $gte: sevenDaysAgo },
  });

  const newUserInLast30UserPromise = UserModel.countDocuments({
    createdAt: { $gte: thirtyDaysAgo },
  });

  const userRolePromise = UserModel.aggregate([
    {
      $group: {
        _id: "$role",
        count: { $sum: 1 },
      },
    },
  ]);

  const [
    totalUser,
    totalActiveUser,
    totalInActiveUser,
    totalBlockUser,
    newUserInLast7User,
    newUserInLast30User,
    userRole,
  ] = await Promise.all([
    totalUserPromise,
    totalActiveUserPromise,
    totalInActiveUserPromise,
    totalBlockUserPromise,
    newUserInLast7UserPromise,
    newUserInLast30UserPromise,
    userRolePromise,
  ]);

  return {
    totalUser,
    totalActiveUser,
    totalInActiveUser,
    totalBlockUser,
    newUserInLast7User,
    newUserInLast30User,
    userRole,
  };
};
```
