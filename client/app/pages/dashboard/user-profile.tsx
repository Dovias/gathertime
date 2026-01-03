import { useParams } from "react-router";
import { useEffect, useState } from "react";
import type { UserProfileInfo } from "../../models/User";
import { getUserProfileInfo } from "../../api/UserApi";

const UserProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<UserProfileInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchProfile = async () => {
      try {
        const data = await getUserProfileInfo(Number(id));
        setProfile(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading) {
    return <div className="text-center py-10 text-gray-500">Kraunama...</div>;
  }

  if (!profile) {
    return <div className="text-center py-10 text-red-500">Vartotojas nerastas</div>;
  }

  return (
    <main className="w-full max-w-8xl mx-auto py-10 px-8">
      <section className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 flex flex-row items-center gap-6">
        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-3xl font-semibold text-gray-600 flex-shrink-0">
          {profile.firstName[0]}
          {profile.lastName[0]}
        </div>
        <h1 className="text-2xl font-semibold text-gray-800 inline-block">
          {profile.firstName} {profile.lastName}
        </h1>
      </section>
    </main>
  );
};

export default UserProfilePage;
