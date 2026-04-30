import List "mo:core/List";
import ProductTypes "types/product";
import ReminderTypes "types/reminder";
import Common "types/common";
import ProductApi "mixins/product-api";
import ReminderApi "mixins/reminder-api";
import StatsApi "mixins/stats-api";

actor {
  let products = List.empty<ProductTypes.Product>();
  let reminders = List.empty<ReminderTypes.Reminder>();
  let productCounter : Common.Counter = { var value = 1 };
  let reminderCounter : Common.Counter = { var value = 1 };

  include ProductApi(products, productCounter);
  include ReminderApi(reminders, reminderCounter);
  include StatsApi(products);
};
