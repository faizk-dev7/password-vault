import { Link } from "react-router-dom";
import { Button } from "../components/Button";
import { updateUser } from "../utils/http";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loading2 } from "../components/Loading2";
import { FaKey } from "react-icons/fa6";
import { FaUser } from "react-icons/fa";
import PropTypes from "prop-types";
import {
    Check,
    CircleCheck,
    CircleUser,
    Eye,
    KeyRound,
    Settings2,
    UserCheck,
    UserCog,
    Vault,
} from "lucide-react";

export const Users = ({ users, showRequestedUsers, currentUser }) => {
    const storedToken = localStorage.getItem("token");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const handleUsersRequest = async (userId, requestedDivision) => {
        setLoading(true);

        const updatedUser = await updateUser(
            {
                userId,
                properties: {
                    division: requestedDivision,
                    requestedDivision: null,
                },
                accept: true,
            },
            false,
            storedToken
        );

        navigate(0);
        setLoading(false);
    };
    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-ss-lg">
            <table className="w-full text-sm text-left text-gray-500 ">
                <thead className="text-sm text-gray-700 uppercase bg-blue-100">
                    <tr scope="col" className="">
                        <th scope="col" className="px-4 py-3">
                            Username
                        </th>
                        <th scope="col" className="px-4 py-3">
                            Name
                        </th>
                        <th scope="col" className="px-4 py-3">
                            Surname
                        </th>
                        <th scope="col" className="px-4 py-3">
                            Title
                        </th>
                        <th scope="col" className="px-4 py-3">
                            Roles
                        </th>
                        <th scope="col" className="px-4 py-3">
                            Operations
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.username} className="bg-white border-b">
                            <td
                                scope="row"
                                className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                                {user.username}
                            </td>
                            <td scope="row" className="px-4 py-3">
                                {user.name}
                            </td>
                            <td scope="row" className="px-4 py-3">
                                {user.surname}
                            </td>
                            <td scope="row" className="px-4 py-3">
                                {user.title}
                            </td>
                            <td scope="row" className="px-4 py-3">
                                <div className="flex gap-0.5 items-center">
                                    {user.roles.map((role) => (
                                        <div
                                            key={role}
                                            className="bg-gray-200 px-1 rounded text-gray-700">
                                            {role.charAt(0).toUpperCase() +
                                                role.slice(1)}
                                        </div>
                                    ))}
                                </div>
                            </td>
                            <td scope="row" className="px-4 py-3">
                                {showRequestedUsers ? (
                                    <>
                                        {loading ? (
                                            <Loading2 />
                                        ) : (
                                            <>
                                                <CircleCheck
                                                    absoluteStrokeWidth
                                                    onClick={() =>
                                                        handleUsersRequest(
                                                            user._id,
                                                            user.requestedDivision
                                                        )
                                                    }
                                                    className="flex items-center gap-1 hover:cursor-pointer hover:text-blue-600"
                                                />
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <div className="flex gap-1 items-center">
                                        <Link
                                            to={`/users/${user._id}/credentials?division=${user.division}`}
                                            className="underline underline-offset-4  hover:text-blue-600 bg-white text-gray-700">
                                            <KeyRound absoluteStrokeWidth />
                                        </Link>

                                        {currentUser.roles.includes(
                                            "admin"
                                        ) && (
                                            <Link
                                                to={`/users/${user._id}/profile?currentUser=false`}
                                                className="underline underline-offset-4  hover:text-blue-600 bg-white text-gray-700">
                                                <UserCog absoluteStrokeWidth />
                                            </Link>
                                        )}
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

Users.propTypes = {
    users: PropTypes.array,
    showRequestedUsers: PropTypes.bool,
};
