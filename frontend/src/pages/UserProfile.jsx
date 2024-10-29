import { Unauthorised } from "../components/Unauthorised";
import { Loading } from "../components/Loading";
import { Error } from "../components/Error";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
    fetchUsernames,
    handleFetchDivisions,
    handleFetchUser,
    updateUser,
} from "../utils/http";
import { Button } from "../components/Button";
import { ShowUserInfo } from "../components/ShowUserInfo";
import Input from "../components/Input";
import {
    usernameExists,
    isEqualsToOtherValue,
    hasMinLength,
} from "../utils/validation.js";
import { Loading2 } from "../components/Loading2.jsx";
import { ArrowLeft } from "lucide-react";

export const UserProfile = () => {
    const storedToken = localStorage.getItem("token");
    const navigate = useNavigate();
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [error, setError] = useState({ message: "" });
    const [fetchedUser, setFetchedUser] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [fetchedUsernames, setFetchedUsernames] = useState([]);
    const [fetchedDivisions, setFetchedDivisions] = useState([]);
    const [afterSubmitMessage, setAfterSubmitMessage] = useState({
        message: "",
        ok: null,
    });
    const [enteredValues, setEnteredValues] = useState({
        previousPassword: "",
        updatedPassword: "",
        username: "",
        name: "",
        surname: "",
        title: "",
        division: "",
    });
    const [currentRoles, setCurrentRoles] = useState([
        { role: "user", set: false },
        { role: "management", set: false },
        { role: "admin", set: false },
    ]);
    const [didEdit, setDidEdit] = useState({
        previousPassword: "",
        updatedPassword: "",
        username: "",
        name: "",
        surname: "",
        title: "",
        division: "",
    });
    const isCurrentUser = searchParams.get("currentUser");
    const fetchedRoles = ["user", "management", "admin"];

    function handleInputBlur(identifier) {
        setDidEdit((prevEdit) => ({
            ...prevEdit,
            [identifier]: true,
        }));
    }

    function handleInputChange(identifier, value) {
        setEnteredValues((prevValues) => ({
            ...prevValues,
            [identifier]: value,
        }));
        setDidEdit((prevEdit) => ({
            ...prevEdit,
            [identifier]: false,
        }));
    }

    if (!storedToken)
        setTimeout(() => {
            navigate("/");
        }, 2000);

    useEffect(() => {
        const getUser = async () => {
            const user = await handleFetchUser(storedToken, id);

            // setform values
            setEnteredValues((prevEdit) => ({
                ...prevEdit,
                username: user.username,
                name: user.name,
                surname: user.surname,
                title: user.title,
                division: user.division._id,
            }));

            setCurrentRoles((prevEdit) =>
                prevEdit.map((role) =>
                    user.roles.includes(role.role)
                        ? { ...role, set: true }
                        : role
                )
            );

            const fetchedUsernames = await fetchUsernames();
            setFetchedUsernames(
                fetchedUsernames.usernames.filter(
                    (username) => username !== user.username
                )
            );
            const divisions = await handleFetchDivisions();
            console.log(divisions);
            console.log("-===-");

            setFetchedDivisions(divisions);
            console.log(fetchedUsernames);
            console.log(user);
            setFetchedUser(user);
            setLoading(false);
        };
        try {
            getUser();
        } catch (err) {
            setError({
                message: err.message || "Error fetching user info or users",
            });
            setLoading(false);
        }
    }, []);

    const handleGoBack = () => {
        navigate("/dashboard");
    };

    const handleIsEditing = () => {
        setIsEditing(!isEditing);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setUpdatingStatus(true);
        const fd = new FormData(event.target);
        const enteredRoles = fd.getAll("roles");
        const formData = Object.fromEntries(fd.entries());
        if (isCurrentUser === "false") {
            formData.roles = ["user", ...enteredRoles];
        }
        console.log(formData);
        console.log("---");
        console.log(enteredValues);
        if (
            fetchedUsernames.includes(formData.username) ||
            (formData.previousPassword !== "" &&
                formData.updatedPassword === "" &&
                formData.updatedPassword.length < 8) ||
            (formData.previousPassword === "" &&
                formData.updatedPassword !== "")
        ) {
            console.log("Invalid");
            setUpdatingStatus(false);
            return;
        }
        const updatedUser = await updateUser(
            {
                userId: id,
                properties: formData,
            },
            isCurrentUser,
            storedToken
        );

        console.log(updatedUser);

        setAfterSubmitMessage({
            ok: updatedUser.ok,
            message: updatedUser.message,
        });
        setTimeout(() => {
            setAfterSubmitMessage({
                message: "",
                ok: null,
            });
            setUpdatingStatus(false);
        }, 2000);

        console.log(updatedUser);
        if (updatedUser.ok) {
            setTimeout(() => {
                navigate("/dashboard");
            }, 1000);
        }
    };

    const handleUpdateUser = async (userId, formData) => {
        // setLoading(true);
        // console.log(isCurrentUser);
        // navigate(0);
        // setLoading(false);
    };

    // form error handling validation
    const checkIfValidUsername =
        didEdit.username &&
        usernameExists(fetchedUsernames, enteredValues.username);

    const checkIfPasswordTooShort =
        didEdit.updatedPassword &&
        !hasMinLength(enteredValues.updatedPassword, 8);

    const checkIfDivisionWasSelected =
        didEdit.requestedDivision &&
        enteredValues.requestedDivision === "default";

    let messageStyles = "text-sm flex items-center pl-2";
    if (afterSubmitMessage.ok === false) messageStyles += " text-red-500 ";
    if (afterSubmitMessage.ok === true) messageStyles += " text-green-500";

    let inputErrorStyles =
        "w-full h-10 px-2 rounded shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]";
    if (checkIfDivisionWasSelected) {
        inputErrorStyles += " border border-red-500 border-solid";
    }

    if (!storedToken) return <Unauthorised />;
    return (
        <div className="flex justify-center">
            {loading ? (
                <Loading loadingMessage="Loading..." />
            ) : error.message === "" ? (
                <div className="flex flex-col gap-2 md:w-1/3 w-full ">
                    <nav className="">
                        <div
                            onClick={handleGoBack}
                            className="flex items-center gap-1 hover:cursor-pointer hover:text-blue-600 underline underline-offset-4">
                            <ArrowLeft
                                absoluteStrokeWidth
                                className="size-5 "
                            />{" "}
                            <span className="text-lg">Go Back</span>
                        </div>
                    </nav>
                    <h1 className="text-2xl mt-3">User Profile Information</h1>
                    <div
                        className=" sm:px-5 sm:py-3 px-3 py-2 rounded-md shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]
                    ">
                        {!isEditing ? (
                            <ShowUserInfo
                                fetchedUser={fetchedUser}
                                handleIsEditing={handleIsEditing}
                            />
                        ) : (
                            <form
                                onSubmit={handleSubmit}
                                id="profile-update-form"
                                className="grid gap-2">
                                <Input
                                    label="Username"
                                    id="username"
                                    type="text"
                                    name="username"
                                    minLength={4}
                                    placeholder={fetchedUser.username}
                                    value={enteredValues.username}
                                    onChange={(event) =>
                                        handleInputChange(
                                            "username",
                                            event.target.value
                                        )
                                    }
                                    onBlur={() => handleInputBlur("username")}
                                    required
                                    error={
                                        checkIfValidUsername &&
                                        "Username exists..."
                                    }
                                />
                                <Input
                                    label="Name"
                                    type="text"
                                    id="name"
                                    name="name"
                                    minLength={2}
                                    placeholder={fetchedUser.name}
                                    value={enteredValues.name}
                                    onChange={(event) =>
                                        handleInputChange(
                                            "name",
                                            event.target.value
                                        )
                                    }
                                    required
                                />
                                <Input
                                    label="Surname"
                                    id="surname"
                                    type="text"
                                    name="surname"
                                    minLength={1}
                                    placeholder={fetchedUser.surname}
                                    value={enteredValues.surname}
                                    onChange={(event) =>
                                        handleInputChange(
                                            "surname",
                                            event.target.value
                                        )
                                    }
                                    required
                                />

                                <Input
                                    label="Title"
                                    type="text"
                                    id="title"
                                    name="title"
                                    placeholder={fetchedUser.title}
                                    value={enteredValues.title}
                                    minLength={1}
                                    onChange={(event) =>
                                        handleInputChange(
                                            "title",
                                            event.target.value
                                        )
                                    }
                                    required
                                />

                                {isCurrentUser === "false" && (
                                    <>
                                        <div className="grid gap-1.5">
                                            <label
                                                htmlFor="division"
                                                className="text-gray-700">
                                                Division
                                            </label>
                                            <select
                                                className={inputErrorStyles}
                                                required
                                                id="division"
                                                name="division"
                                                value={enteredValues.division}
                                                onChange={(event) =>
                                                    handleInputChange(
                                                        "division",
                                                        event.target.value
                                                    )
                                                }
                                                onBlur={() =>
                                                    handleInputBlur("division")
                                                }>
                                                <option value="default">
                                                    Select A Division
                                                </option>
                                                {fetchedDivisions.allDivisions.map(
                                                    (division) => (
                                                        <option
                                                            key={division._id}
                                                            value={
                                                                division._id
                                                            }>
                                                            {division.name}
                                                        </option>
                                                    )
                                                )}
                                            </select>
                                            <div className="">
                                                {checkIfDivisionWasSelected && (
                                                    <p>
                                                        Please select a division
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="grid gap-1.5">
                                            <label className="text-gray-700">
                                                Role(s)
                                            </label>
                                            <fieldset className="w-full h-10 px-2 flex items-center rounded gap-1 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]">
                                                {currentRoles.map((role) => (
                                                    <div
                                                        key={role.role}
                                                        className="flex items-center gap-1">
                                                        <input
                                                            type="checkbox"
                                                            id={role.role}
                                                            name="roles"
                                                            value={role.role}
                                                            defaultChecked={
                                                                role.set
                                                            }
                                                            disabled={
                                                                role.role ===
                                                                "user"
                                                            }
                                                        />

                                                        <label
                                                            htmlFor={role.role}>
                                                            {role.role
                                                                .charAt(0)
                                                                .toUpperCase() +
                                                                role.role.slice(
                                                                    1
                                                                )}
                                                        </label>
                                                    </div>
                                                ))}
                                            </fieldset>
                                            <div></div>
                                        </div>
                                    </>
                                )}

                                <Input
                                    label="Enter Previous Password"
                                    id="previousPassword"
                                    type="password"
                                    name="previousPassword"
                                    value={enteredValues.previousPassword}
                                    onChange={(event) =>
                                        handleInputChange(
                                            "previousPassword",
                                            event.target.value
                                        )
                                    }
                                    onBlur={() =>
                                        handleInputBlur("previousPassword")
                                    }
                                />
                                <Input
                                    label="Updated Password"
                                    id="updatedPassword"
                                    type="password"
                                    name="updatedPassword"
                                    value={enteredValues.updatedPassword}
                                    onChange={(event) =>
                                        handleInputChange(
                                            "updatedPassword",
                                            event.target.value
                                        )
                                    }
                                    minLength={8}
                                    onBlur={() =>
                                        handleInputBlur("updatedPassword")
                                    }
                                    error={
                                        checkIfPasswordTooShort &&
                                        enteredValues.previousPassword !== "" &&
                                        "Password must be at least 8 characters"
                                    }
                                />

                                <div className="flex justify-between ">
                                    <div className={messageStyles}>
                                        {afterSubmitMessage.message !== "" ? (
                                            <p>{afterSubmitMessage.message}</p>
                                        ) : undefined}
                                    </div>
                                    <div className="flex sm:gap-2 gap-1">
                                        {isEditing && (
                                            <>
                                                <Button
                                                    customStyles="tertiary"
                                                    onClick={handleIsEditing}
                                                    type="button">
                                                    Cancel
                                                </Button>
                                                {updatingStatus ? (
                                                    <Button
                                                        customStyles="primary"
                                                        type="submit"
                                                        disabled>
                                                        Save
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        customStyles="primary"
                                                        type="submit">
                                                        Save
                                                    </Button>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            ) : (
                <Error>{error.message}</Error>
            )}
        </div>
    );
};
