// import { useQuery } from "@tanstack/react-query";
// import { api } from "../lib/api";
// import Navbar from "./Navbar";
// import Footer from "./Footer";
// import { useEffect, useState } from "react";

// interface UserProfile {
//   id: string;
//   name: string;
//   email: string;
//   headline?: string;
//   avatarUrl?: string;
// }

// const Profile = () => {
//   const [email, ] = useState("");
// const [formData, setFormData] = useState<UserProfile | null>(null);
//   const { data: user, isLoading, error } = useQuery({
//     queryKey: ["me"],
//     queryFn: async () => {
//       const res = await api.get(`/users/email?email=${email}`);
//       return res.data;
//     },
//     enabled: !!email,
//   });

//  useEffect(() => {
//     if (user) {
//       setFormData(user);
//     }
//   }, [user]);

//   if (isLoading || !!formData) return <p className="mt-10 text-center">Loading...</p>;
//   if (error) return <p className="mt-10 text-center">Failed to load profile.</p>;

//   return (
//     <>
//       <Navbar />
//       <div className="py-10 custom-container">
//         <div className="flex flex-col items-center justify-start md:justify-center">
//           <div className="flex flex-row items-start justify-start md:justify-center">

//           {/* <h3 className="mb-6 text-3xl font-bold text-neutral-900">My Profile</h3> */}
//           <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
//             <img
//               src={user.avatarUrl || "/images/avatar.png"}
//               alt={user.name}
//               className="object-cover w-32 h-32 border rounded-full border-neutral-300"
//               />
//             <div className="space-y-2">
//               <p className="text-lg font-semibold text-neutral-800">{user.name}</p>
//               <p className="text-sm text-neutral-600">{user.email}</p>
//               <p className="text-sm text-neutral-600">{user.headline ?? "No headline set"}</p>
//             </div>
//           </div>
//               </div>
//         </div>
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default Profile;
