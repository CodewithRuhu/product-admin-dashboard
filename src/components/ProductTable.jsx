import Image from "next/image";
import Link from "next/link";

export default function ProductTable({ products, onDelete }) {
  return (
    <table className="w-full text-sm text-left border-collapse">
      <thead>
        <tr className="border-b text-gray-500">
          <th className="py-2 pr-4">Image</th>
          <th className="py-2 pr-4">Title</th>
          <th className="py-2 pr-4">Category</th>
          <th className="py-2 pr-4">Price</th>
          <th className="py-2 pr-4">Rating</th>
          <th className="py-2 pr-4">Stock</th>
          <th className="py-2 pr-4">Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr key={product.id} className="border-b hover:bg-gray-50">
            <td className="py-2 pr-4">
              <Image
                src={product.thumbnail}
                alt={product.title}
                width={48}
                height={48}
                className="rounded object-cover"
              />
            </td>
            <td className="py-2 pr-4">
              <Link href={`/products/${product.id}`} className="text-blue-600 hover:underline">
                {product.title}
              </Link>
            </td>
            <td className="py-2 pr-4 capitalize">{product.category}</td>
            <td className="py-2 pr-4">${product.price}</td>
            <td className="py-2 pr-4">{product.rating}</td>
            <td className="py-2 pr-4">{product.stock}</td>
            <td className="py-2 pr-4 space-x-2">
              <Link
                href={`/products/edit/${product.id}`}
                className="text-blue-600 hover:underline"
              >
                Edit
              </Link>
              <button
                onClick={() => onDelete(product)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}