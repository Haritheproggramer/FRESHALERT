import List "mo:core/List";
import Time "mo:core/Time";
import ProductLib "../lib/product";
import ProductTypes "../types/product";
import Common "../types/common";

mixin (products : List.List<ProductTypes.Product>, productCounter : Common.Counter) {

  public func createProduct(args : ProductTypes.CreateProductArgs) : async ProductTypes.Product {
    let nowMs = Time.now() / 1_000_000;
    let (product, newId) = ProductLib.create(products, args, nowMs, productCounter.value);
    productCounter.value := newId;
    product
  };

  public query func getProducts() : async [ProductTypes.Product] {
    ProductLib.getAll(products)
  };

  public query func getProductById(id : Common.ProductId) : async ?ProductTypes.Product {
    ProductLib.getById(products, id)
  };

  public func updateProduct(args : ProductTypes.UpdateProductArgs) : async Bool {
    let nowMs = Time.now() / 1_000_000;
    ProductLib.update(products, args, nowMs)
  };

  public func deleteProduct(id : Common.ProductId) : async Bool {
    ProductLib.delete(products, id)
  };

  public query func getProductsByCategory(category : Text) : async [ProductTypes.Product] {
    ProductLib.getByCategory(products, category)
  };

  public func initSampleData() : async () {
    let nowMs = Time.now() / 1_000_000;
    productCounter.value := ProductLib.initSample(products, nowMs, productCounter.value)
  };
};
