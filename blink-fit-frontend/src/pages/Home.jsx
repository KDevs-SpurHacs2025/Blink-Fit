import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import PrimaryButton from "../components/PrimaryButton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
} from "recharts";
import useUserStore from "../store/userStore";
import { getApi } from "../api/getApi";

const handleStartEyeTracking = () => {
  const trackerUrl = "/tracker.html"; // public 폴더 기준
  window.trackerWindow = window.open(
    trackerUrl,
    "_blank",
    "width=800,height=600"
  );
};

const Home = () => {
  const navigate = useNavigate();
  const userId = useUserStore((state) => state.user.id);
  const breakTimeCount = useUserStore((state) => state.breakTimeCount);
  const breakCompletionCount = useUserStore(
    (state) => state.breakCompletionCount
  );
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    getApi(`https://api-lcq5pbmy4q-pd.a.run.app/user/${userId}`)
      .then((data) => {
        setUserData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [userId]);

  // 실제 데이터는 userData?.data에 있음
  const apiData = userData?.data;
  const data = apiData?.recentScreenTimes
    ? apiData.recentScreenTimes.map((value, idx) => ({
        name: `${idx + 1}`,
        value,
      }))
    : [
        { name: "1", value: 6 },
        { name: "2", value: 5 },
        { name: "3", value: 4 },
        { name: "4", value: 7 },
        { name: "5", value: 3 },
        { name: "6", value: 5 },
        { name: "7", value: 2 },
      ];

  const avg =
    apiData?.recentScreenTimes && apiData.recentScreenTimes.length
      ? apiData.recentScreenTimes.reduce((a, b) => a + b, 0) /
        apiData.recentScreenTimes.length
      : 4;

  // Break Completion Rate 계산
  const breakCompletionRate =
    breakTimeCount > 0
      ? Math.round((breakCompletionCount / breakTimeCount) * 100)
      : 0;

  if (loading) return <div>Loading...</div>;
  if (error) return <div>에러 발생: {error.message}</div>;

  return (
    <div className="w-full h-full gap-6 flex flex-col items-center justify-center bg-bg-color">
      <div className="w-5/6 h-full pt-6 flex flex-col items-center justify-center ">
        <h2 className="text-xl font-bold mb-4 text-left">
          Screen Time Overview: Last 7 Sessions
        </h2>
        {/* Grid 1 */}
        <div className="flex items-center justify-between bg-[#F3F3F3] rounded-xl shadow-md p-4 mb-4 h-2/5">
          <div className="w-1/2 h-full flex flex-col items-start justify-center pr-8">
            <div className="mb-2">
              <div className="text-sm font-semibold text-text-dark-gray mb-1">
                Total
              </div>
              <div className="text-xl font-semibold text-black mb-2">
                {apiData?.recentScreenTimes
                  ? `${apiData.recentScreenTimes
                      .reduce((a, b) => a + b, 0)
                      .toFixed(1)}h`
                  : "20h"}
              </div>
            </div>
            <div className="mb-2">
              <div className="text-sm font-semibold text-text-dark-gray mb-1">
                Average
              </div>
              <div className="text-xl font-semibold text-black mb-2">
                {apiData?.averageUsageTime
                  ? `${avg.toFixed(1)} hours/day`
                  : "5 hours/day"}
              </div>
            </div>
            <div className="flex items-start gap-2 mt-2 mb-6">
              <span className="text-xs">💡</span>
              <span className="text-xs text-text-dark-gray">
                {apiData?.weeklyTrend === "Not enough data for trend analysis"
                  ? "Close your eyes for 2 seconds, open for 2 seconds, then close for 2 seconds."
                  : apiData?.weeklyTrend
                  ? typeof apiData.weeklyTrend === "string"
                    ? apiData.weeklyTrend
                    : `Your weekly trend: ${apiData.weeklyTrend}%`
                  : "Tip: Remember to blink often to keep your eyes moist and reduce strain."}
              </span>
            </div>
          </div>
          {/* Bar graph */}
          <div className="w-1/2 h-full flex items-end gap-1">
            <ResponsiveContainer className="w-1/3 h-100%">
              <BarChart data={data} barCategoryGap={6}>
                <Bar dataKey="value" radius={[10, 10, 0, 0]} fill="#333333">
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.value > avg ? "#E86400" : "#333333"}
                    />
                  ))}
                </Bar>
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 14 }}
                />
                <YAxis hide />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Grid 2 & 3 */}
        <div className="h-1/4 grid grid-cols-2 gap-4 mb-4">
          {/* Grid 2 */}
          <div className="bg-[#F3F3F3] rounded-xl shadow p-6 flex flex-col text-center justify-center items-center">
            <div className="text-sm text-text-dark-gray font-base mb-2">
              Your average blinks
            </div>
            <div className="text-4xl font-bold mb-3">
              {apiData?.averageBlink ? `${apiData.averageBlink}/min` : "12/min"}
            </div>
            <div className="text-sm text-black">
              {apiData?.averageBlink ? (
                <>
                  <span className="font-bold">{15 - apiData.averageBlink}</span>{" "}
                  below healthy average (15-20/min)
                </>
              ) : (
                "3 below healthy average (15-20/min)"
              )}
            </div>
          </div>
          {/* Grid 3 */}
          <div className="bg-[#F3F3F3] rounded-xl shadow p-6 flex flex-col text-center justify-center items-center">
            <div className="text-sm text-text-dark-gray font-base mb-2">
              Break Completion Rate
            </div>
            <div className="text-4xl font-bold mb-3">
              {breakTimeCount > 0 ? `${breakCompletionRate}%` : "-"}
            </div>
            <div className="text-sm text-black">
              {breakTimeCount > 0
                ? "Try to take more breaks 🧘"
                : "Not enough routine data 😢"}
            </div>
          </div>
        </div>
        {/* Grid 4 */}
        <div className="w-full flex justify-center mt-2">
          <PrimaryButton
            onClick={() => {
              handleStartEyeTracking();
              navigate("/screen-time");
            }}
          >
            Start Today's Routine &gt;
          </PrimaryButton>
        </div>
        <NavBar />
      </div>
    </div>
  );
};

export default Home;
