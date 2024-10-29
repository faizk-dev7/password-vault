export const InputDisplay = ({ label, value }) => {
    return (
        <div className="grid gap-1.5">
            <div className="text-gray-700">{label} </div>
            <div className="w-full h-10 px-2 flex items-center rounded shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]">
                {value}
            </div>
            <div className=""></div>
        </div>
    );
};
