import List "mo:core/List";
import Nat "mo:core/Nat";
import ProductTypes "../types/product";
import StatsTypes "../types/stats";

module {
  public type Product = ProductTypes.Product;
  public type Stats = StatsTypes.Stats;

  public func getTotal(products : List.List<Product>) : Nat {
    products.size()
  };

  public func getExpiredCount(products : List.List<Product>) : Nat {
    products.filter(func(p) { p.status == "expired" }).size()
  };

  public func getSoonCount(products : List.List<Product>) : Nat {
    products.filter(func(p) { p.status == "soon" }).size()
  };

  public func getFreshCount(products : List.List<Product>) : Nat {
    products.filter(func(p) { p.status == "safe" }).size()
  };

  // Estimate waste saved: each non-expired product is worth ~$5 on average
  public func getWasteSaved(products : List.List<Product>) : Float {
    let nonExpired = products.filter(func(p) { p.status != "expired" }).size();
    nonExpired.toFloat() * 5.0
  };
};
