import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../api/axiosInstance";
import { getToken } from "../../utils/auth";
import InternLayout from "../../layouts/InternLayout";

function Meetings() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  const authHeader = {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  };

  const fetchMeetings = async () => {
    try {
      const response = await axiosInstance.get("/intern/meetings", authHeader);
      setMeetings(response.data);
    } catch (error) {
      console.error("Intern meetings fetch error:", error);
      toast.error("Session expired. Please log in again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  return (
    // <InternLayout title="Meetings">
    //   {loading ? (
    //     <div>Loading meetings...</div>
    //   ) : (
    //     <div className="bg-white rounded-2xl shadow overflow-hidden">
    //       <div className="px-6 py-4 border-b">
    //         <h2 className="text-xl font-semibold text-slate-800">
    //           Meetings List
    //         </h2>
    //       </div>

    //       {meetings.length === 0 ? (
    //         <div className="p-6 text-slate-500">No meetings found.</div>
    //       ) : (
    //         <div className="overflow-x-auto">
    //           <table className="w-full text-left">
    //             <thead className="bg-slate-100 text-slate-700">
    //               <tr>
    //                 <th className="px-6 py-4">Title</th>
    //                 <th className="px-6 py-4">Date</th>
    //                 <th className="px-6 py-4">Start Time</th>
    //                 <th className="px-6 py-4">End Time</th>
    //                 <th className="px-6 py-4">Link</th>
    //               </tr>
    //             </thead>

    //             <tbody>
    //               {meetings.map((meeting) => (
    //                 <tr key={meeting.id} className="border-t">
    //                   <td className="px-6 py-4 font-medium text-slate-800">
    //                     {meeting.title}
    //                   </td>

    //                   <td className="px-6 py-4 text-slate-600">
    //                     {meeting.meetingDate}
    //                   </td>

    //                   <td className="px-6 py-4 text-slate-600">
    //                     {meeting.startTime}
    //                   </td>

    //                   <td className="px-6 py-4 text-slate-600">
    //                     {meeting.endTime}
    //                   </td>

    //                   <td className="px-6 py-4">
    //                     <a
    //                       href={meeting.meetingLink}
    //                       target="_blank"
    //                       rel="noreferrer"
    //                       className="text-blue-600 hover:underline"
    //                     >
    //                       Join Meeting
    //                     </a>
    //                   </td>
    //                 </tr>
    //               ))}
    //             </tbody>
    //           </table>
    //         </div>
    //       )}
    //     </div>
    //   )}
    // </InternLayout>

    <InternLayout title="Meetings">
      {loading ? (
        <div className="text-sm text-slate-500">Loading meetings...</div>
      ) : (
        <div className="bg-white rounded-xl shadow border overflow-hidden max-w-[1400px] mx-auto scale-[0.9] origin-top">
          <div className="px-5 py-3 border-b">
            <h2 className="text-base font-semibold text-slate-800">
              Meetings List
            </h2>
          </div>

          {meetings.length === 0 ? (
            <div className="p-5 text-sm text-slate-500">No meetings found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-100 text-slate-600">
                  <tr>
                    <th className="px-5 py-3 font-medium">Title</th>
                    <th className="px-5 py-3 font-medium">Date</th>
                    <th className="px-5 py-3 font-medium">Start Time</th>
                    <th className="px-5 py-3 font-medium">End Time</th>
                    <th className="px-5 py-3 font-medium">Link</th>
                  </tr>
                </thead>

                <tbody>
                  {meetings.map((meeting) => (
                    <tr
                      key={meeting.id}
                      className="border-t hover:bg-slate-50 transition"
                    >
                      <td className="px-5 py-3 font-medium text-slate-800">
                        {meeting.title}
                      </td>

                      <td className="px-5 py-3 text-slate-600">
                        {meeting.meetingDate}
                      </td>

                      <td className="px-5 py-3 text-slate-600">
                        {meeting.startTime}
                      </td>

                      <td className="px-5 py-3 text-slate-600">
                        {meeting.endTime}
                      </td>

                      <td className="px-5 py-3">
                        <a
                          href={meeting.meetingLink}
                          target="_blank"
                          rel="noreferrer"
                          className="text-teal-600 hover:text-teal-700 font-medium hover:underline"
                        >
                          Join Meeting
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </InternLayout>
  );
}

export default Meetings;
