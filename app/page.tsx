// import Image from "next/image";


export default async function Home() {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/health_check`;
  const response = await fetch(apiUrl, {
    cache: 'no-store'
  });
  const data = await response.json();
  const message = data.message;

  return (
    <div className="p-32">
      <div className="mt-8 p-4 bg-gray-100 rounded">
        <p>{message}</p>
      </div>
    </div>
  );
}
