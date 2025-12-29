export default function CartItem({ item }: { item: any }) {
  const variant = item.node.merchandise;

  return (
    <div className="flex gap-4 py-4 border-b">
      <img
        src={variant.image?.url}
        alt={variant.image?.altText || variant.product.title}
        className="h-24 w-24 rounded object-cover"
      />

      <div className="flex flex-col justify-between flex-1">
        <div>
          <p className="font-medium">{variant.product.title}</p>
          <p className="text-sm text-neutral-500">{variant.title}</p>
        </div>

        <div className="flex justify-between items-center">
          <span>Cant: {item.node.quantity}</span>
          <span>
            {variant.price.amount} {variant.price.currencyCode}
          </span>
        </div>
      </div>
    </div>
  );
}
