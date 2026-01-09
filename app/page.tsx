import DocumentList from './components/DocumentList';

export default function Home() {
  return (
    <div className="p-4 lg:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">My Documents</h1>
        <p className="text-gray-600">Manage your files and folders</p>
      </div>
      <DocumentList />
    </div>
  );
}
