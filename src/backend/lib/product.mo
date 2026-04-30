import List "mo:core/List";
import Nat "mo:core/Nat";
import ProductTypes "../types/product";
import Common "../types/common";

module {
  public type Product = ProductTypes.Product;
  public type ProductId = Common.ProductId;
  public type Timestamp = Common.Timestamp;
  public type CreateProductArgs = ProductTypes.CreateProductArgs;
  public type UpdateProductArgs = ProductTypes.UpdateProductArgs;

  public func computeStatus(expiryDate : Timestamp, nowMs : Timestamp) : Text {
    let diffMs = expiryDate - nowMs;
    let threeDaysMs : Int = 3 * 24 * 60 * 60 * 1000;
    if (diffMs < 0) {
      "expired"
    } else if (diffMs <= threeDaysMs) {
      "soon"
    } else {
      "safe"
    }
  };

  public func create(
    products : List.List<Product>,
    args : CreateProductArgs,
    nowMs : Timestamp,
    nextId : Nat,
  ) : (Product, Nat) {
    let id = "p" # nextId.toText();
    let status = computeStatus(args.expiryDate, nowMs);
    let product : Product = {
      id;
      name = args.name;
      category = args.category;
      location = args.location;
      expiryDate = args.expiryDate;
      openedDate = args.openedDate;
      photo = args.photo;
      notes = args.notes;
      status;
      createdAt = nowMs;
    };
    products.add(product);
    (product, nextId + 1)
  };

  public func getAll(products : List.List<Product>) : [Product] {
    products.toArray()
  };

  public func getById(products : List.List<Product>, id : ProductId) : ?Product {
    products.find(func(p) { p.id == id })
  };

  public func update(
    products : List.List<Product>,
    args : UpdateProductArgs,
    nowMs : Timestamp,
  ) : Bool {
    let found = products.findIndex(func(p) { p.id == args.id });
    switch (found) {
      case null { false };
      case (?idx) {
        let status = computeStatus(args.expiryDate, nowMs);
        let existing = products.at(idx);
        products.put(
          idx,
          {
            existing with
            name = args.name;
            category = args.category;
            location = args.location;
            expiryDate = args.expiryDate;
            openedDate = args.openedDate;
            photo = args.photo;
            notes = args.notes;
            status;
          },
        );
        true
      };
    }
  };

  public func delete(products : List.List<Product>, id : ProductId) : Bool {
    let found = products.findIndex(func(p) { p.id == id });
    switch (found) {
      case null { false };
      case (?idx) {
        let before = products.sliceToArray(0, idx);
        let after = products.sliceToArray(idx + 1, products.size().toInt());
        products.clear();
        for (p in before.values()) { products.add(p) };
        for (p in after.values()) { products.add(p) };
        true
      };
    }
  };

  public func getByCategory(products : List.List<Product>, category : Text) : [Product] {
    products.filter(func(p) { p.category == category }).toArray()
  };

  public func initSample(products : List.List<Product>, nowMs : Timestamp, startId : Nat) : Nat {
    if (not products.isEmpty()) { return startId };
    let dayMs : Int = 24 * 60 * 60 * 1000;
    let samples : [(Text, Text, Text, Int)] = [
      ("Fresh Milk", "Food", "Fridge", 2),
      ("Greek Yogurt", "Food", "Fridge", 5),
      ("Chicken Breast", "Food", "Fridge", 1),
      ("Orange Juice", "Food", "Pantry", 7),
      ("Bread Loaf", "Food", "Pantry", -1),
      ("Ibuprofen 200mg", "Medicine", "Cabinet", 180),
      ("Vitamin C Tablets", "Medicine", "Cabinet", 90),
      ("Cough Syrup", "Medicine", "Cabinet", -2),
      ("Shampoo", "Daily", "Bathroom", 30),
      ("Sunscreen SPF50", "Daily", "Cabinet", 3),
    ];
    var counter = startId;
    for ((name, category, location, daysFromNow) in samples.values()) {
      let expiryDate = nowMs + (daysFromNow * dayMs);
      let status = computeStatus(expiryDate, nowMs);
      let id = "p" # counter.toText();
      counter += 1;
      products.add({
        id;
        name;
        category;
        location;
        expiryDate;
        openedDate = null;
        photo = null;
        notes = null;
        status;
        createdAt = nowMs;
      });
    };
    counter
  };
};
