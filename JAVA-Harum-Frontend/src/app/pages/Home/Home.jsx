import TopSection from "./partials/TopSection";
import PopularSection from "./partials/PopularSection";
import TabSection from "./partials/TabSection";

export default function Home() {
  return (
    <div className="flex min-h-screen">
      <div className="w-6xl mx-auto">
        <div className="flex flex-col w-full">
          <>
            <div className="mb-6">
              <TopSection />
              <PopularSection />
            </div>
            <div className="grid grid-cols-13 gap-x-10 w-full mb-10">
              <div className="col-span-9">
                <TabSection />
              </div>
              <div className="col-span-4 mt-10">
                {/* <AccountSection users={users} /> */}
              </div>
            </div>
          </>
        </div>
      </div>
    </div>
  );
}
