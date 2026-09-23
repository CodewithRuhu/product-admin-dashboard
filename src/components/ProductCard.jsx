import Image from "next/image";
import Link from "next/link";

export default function ProductCard({ product, onDelete }) {
  return (
    <div className="border rounded-lg p-4 flex gap-4">
      <Image
        src={product.thumbnail}
        alt={product.title}
        width={64}
        height={64}
        className="rounded object-cover"
      />

      <div className="flex-1">
        <Link href={`/products/${product.id}`} className="font-medium text-blue-600 hover:underline">
          {product.title}
        </Link>
        <p className="text-sm text-gray-500 capitalize">{product.category}</p>
        <div className="flex justify-between text-sm mt-1">
          <span>${product.price}</span>
          <span>⭐ {product.rating}</span>
          <span>Stock: {product.stock}</span>
        </div>
        <div className="flex gap-3 mt-2 text-sm">
          <Link href={`/products/edit/${product.id}`} className="text-blue-600 hover:underline">
            Edit
          </Link>
          <button onClick={() => onDelete(product)} className="text-red-600 hover:underline">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}