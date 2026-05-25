import React from "react";
import OtherAccount from "./OtherAccount";

export default function AccountSection({ users }) {
  return (
    <div className="p-4 border-1 h-fit  border-text2">
      <div className="flex justify-between mb-4">
        <p className="font-medium">Cây bút nổi bật</p>
        <p className="text-ssm hover:text-pblue text-text2 cursor-pointer">
          Xem thêm
        </p>
      </div>
      <div className="flex flex-col gap-y-2">
        {users.map((user, index) => (
          <OtherAccount user={user} key={index} />
        ))}
      </div>
    </div>
  );
}
