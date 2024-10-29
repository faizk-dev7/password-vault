import { InputDisplay } from "./InputDisplay";
import { Button } from "./Button";

export const ShowUserInfo = ({ fetchedUser, handleIsEditing }) => {
    return (
        <div className="grid gap-2">
            <InputDisplay label="Username" value={fetchedUser.username} />
            <InputDisplay label="Name" value={fetchedUser.name} />
            <InputDisplay label="Surname" value={fetchedUser.surname} />
            <InputDisplay label="Title" value={fetchedUser.title} />
            {fetchedUser.division !== null ? (
                <InputDisplay
                    label="Division"
                    value={fetchedUser.division.name}
                />
            ) : (
                <InputDisplay
                    label="Requested Division"
                    value={fetchedUser.requestedDivision.name}
                />
            )}
            <div className="grid gap-1.5">
                <div className="text-gray-700">Role(s): </div>
                <div className="w-full h-10 px-2 flex items-center rounded gap-1 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]">
                    {fetchedUser.roles.map((role) => (
                        <span key={role} className="">
                            {role.charAt(0).toUpperCase() + role.slice(1)}
                        </span>
                    ))}
                </div>
                <div></div>
            </div>
            <div className="flex md:gap-2 justify-between">
                <div className="text-sm flex items-center pl-2"></div>
                <div>
                    <Button customStyles="primary" onClick={handleIsEditing}>
                        Edit
                    </Button>
                </div>
            </div>
        </div>
    );
};
