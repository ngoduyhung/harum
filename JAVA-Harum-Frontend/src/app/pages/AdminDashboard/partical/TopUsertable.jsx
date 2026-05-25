import React from 'react';
import { Link } from 'react-router-dom'; 
import { Award, User, ClipboardX } from 'lucide-react'; 

const SkeletonRow = () => (
    <tr className="animate-pulse">
        <td className="p-3">
            <div className="flex items-center gap-3">
                <div className="w-5 h-4 bg-slate-200 rounded"></div>
                <div className="bg-slate-200 rounded-full w-10 h-10"></div> 
                <div className="flex flex-col gap-2">
                    <div className="bg-slate-200 rounded h-4 w-28"></div> 
                </div>
            </div>
        </td>
        <td className="p-3 text-right">
            <div className="bg-slate-200 rounded h-5 w-12 ml-auto"></div> 
        </td>
    </tr>
);

const TopUsersTable = ({ title, data, isLoading, valueLabel = "Điểm" }) => {

    if (!isLoading && (!data || data.length === 0)) {
        return (
            <div>
                <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center">
                    <Award className="mr-2 text-amber-500" />
                    {title}
                </h3>
                <div className="flex flex-col items-center justify-center text-center p-8 bg-slate-50 rounded-lg h-64">
                    <ClipboardX className="w-12 h-12 text-slate-400 mb-4" />
                    <p className="font-semibold text-slate-600">Không có dữ liệu</p>
                    <p className="text-sm text-slate-500">Chưa có người dùng nào trong danh mục này.</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center">
                <Award className="mr-2 text-amber-500" />
                {title}
            </h3>
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-slate-500">
                        <tr>
                            <th className="p-3 text-left font-semibold rounded-l-lg">Người dùng</th>
                            <th className="p-3 text-right font-semibold rounded-r-lg">{valueLabel}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, index) => <SkeletonRow key={index} />)
                        ) : (
                            data.map((user, index) => (
                                <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
                                    <td className="p-3">
                                        <Link to={`/admin/profile/${user.userId}`} className="flex items-center gap-4 group">
                                            <span className="font-bold text-slate-400 w-5 text-center">{index + 1}</span>
                                            <img
                                                src={user.avatarUrl || "/defaultAvatar.jpg"}
                                                alt={user.username}
                                                className="w-10 h-10 rounded-full object-cover shadow-sm"
                                            />
                                            <span className="font-semibold text-slate-800 group-hover:text-pblue transition-colors truncate">
                                                {user.username}
                                            </span>
                                        </Link>
                                    </td>
                                    <td className="p-3 text-right">
                                        <span className="font-bold text-pblue text-base">
                                            {user.value?.toLocaleString() ?? 0}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TopUsersTable;