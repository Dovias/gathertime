import { useState, useEffect } from "react";
import type { UserFullName } from "../../models/User";
import { searchUsers } from "../../api/UserApi";
import { SearchField } from "../ui/SearchField";

export const UserSearch: React.FC = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<UserFullName[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const handler = setTimeout(() => {
      const fetchUsers = async () => {
        setLoading(true);
        try {
          const users = await searchUsers(query);
          setResults(users);
        } catch (error) {
          console.error(error);
          setResults([]);
        } finally {
          setLoading(false);
        }
      };
      fetchUsers();
    }, 300);

    return () => clearTimeout(handler);
  }, [query]);

  return (
    <div className="w-full max-w-md mx-auto p-4 relative">
      <SearchField
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ieškoti vartotojų..."
        className="w-full"
      />

      {(loading || results.length > 0 || query) && (
        <ul className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-auto">
          {loading && (
            <li className="p-3 text-gray-500 text-center">Ieško...</li>
          )}

          {!loading && results.length === 0 && query && (
            <li className="p-3 text-gray-400 text-center">Nieko nerasta</li>
          )}

          {!loading &&
            results.map((user) => (
              <li
                key={user.id}
                className="p-3 hover:bg-gray-100 cursor-pointer transition rounded-md"
              >
                {user.firstName} {user.lastName}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};
