import { useState } from "react";
import { handleRegisterUser } from "../utils/http.js";
import {
    usernameExists,
    isEqualsToOtherValue,
    hasMinLength,
} from "../utils/validation.js";
import Input from "./Input.jsx";
import { Button } from "./Button.jsx";
import { Loading2 } from "./Loading2.jsx";
import PropTypes from "prop-types";

export const Register = ({
    handleChangeCurForm,
    fetchedUsernames,
    fetchedDivisions,
}) => {
    const [afterSubmitMessage, setAfterSubmitMessage] = useState({
        message: "",
        ok: null,
    });
    const [enteredValues, setEnteredValues] = useState({
        password: "",
        confirmedPassword: "",
        username: "",
        requestedDivision: "default",
    });
    const [didEdit, setDidEdit] = useState({
        password: "",
        confirmedPassword: "",
        username: "",
        requestedDivision: "",
    });
    const [loading, setLoading] = useState(false);

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

    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true);
        const fd = new FormData(event.target);
        const formData = Object.fromEntries(fd.entries());
        console.log(formData);

        async function callHandleRegisterUser() {
            if (
                fetchedUsernames.includes(formData.username) ||
                formData.password !== formData.confirmedPassword ||
                formData.password.length < 8 ||
                formData.requestedDivision === "default"
            ) {
                console.log("Invalid");
                return;
            }
            console.log("succeed");
            const requestOutcome = await handleRegisterUser(formData);

            if (requestOutcome.ok) {
                document.getElementById("register-form").reset();
                localStorage.setItem(
                    "enteredUsername",
                    requestOutcome.username
                );

                setTimeout(() => {
                    handleChangeCurForm("login");
                }, 2000);
                setTimeout(() => {
                    localStorage.removeItem("enteredUsername");
                }, 10000);
            }
            setLoading(false);
            setAfterSubmitMessage(requestOutcome);
            setTimeout(() => {
                setAfterSubmitMessage({
                    message: "",
                    ok: null,
                });
            }, 3000);
        }

        callHandleRegisterUser();
    };

    // form error handling validation
    const checkIfValidUsername =
        didEdit.username &&
        usernameExists(fetchedUsernames, enteredValues.username);

    const checkIfPasswordsMatch =
        didEdit.confirmedPassword &&
        !isEqualsToOtherValue(
            enteredValues.password,
            enteredValues.confirmedPassword
        );

    const checkIfPasswordTooShort =
        didEdit.password && !hasMinLength(enteredValues.password, 8);

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

    return (
        <>
            <h2 className="text-2xl text-center mb-2">Create an account</h2>
            <div className="flex justify-center mb-4">
                <form
                    onSubmit={handleSubmit}
                    id="register-form"
                    className="sm:px-5 sm:py-3 px-3 py-2 grid gap-2 rounded-md md:w-1/3 w-full 
                    shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]">
                    <Input
                        label="Name"
                        type="text"
                        id="name"
                        name="name"
                        required
                        minLength={1}
                    />
                    <Input
                        label="Surname"
                        id="surname"
                        type="text"
                        name="surname"
                        required
                        minLength={1}
                    />
                    <Input
                        label="Username"
                        id="username"
                        type="text"
                        name="username"
                        value={enteredValues.username}
                        onChange={(event) =>
                            handleInputChange("username", event.target.value)
                        }
                        onBlur={() => handleInputBlur("username")}
                        minLength={4}
                        required
                        error={checkIfValidUsername && "Username exists..."}
                    />

                    <Input
                        label="Title"
                        type="text"
                        id="title"
                        name="title"
                        required
                    />

                    <div className="grid gap-1.5">
                        <label
                            htmlFor="requestedDivision"
                            className="text-gray-600">
                            Request A Division To Join
                        </label>
                        <select
                            className={inputErrorStyles}
                            required
                            id="requestedDivision"
                            name="requestedDivision"
                            value={enteredValues.requestedDivision}
                            onChange={(event) =>
                                handleInputChange(
                                    "requestedDivision",
                                    event.target.value
                                )
                            }
                            onBlur={() => handleInputBlur("requestedDivision")}>
                            <option value="default">Select A Division</option>
                            {fetchedDivisions.allDivisions.map((division) => (
                                <option key={division._id} value={division._id}>
                                    {division.name}
                                </option>
                            ))}
                        </select>
                        <div className="">
                            {checkIfDivisionWasSelected && (
                                <p>Please select a division</p>
                            )}
                        </div>
                    </div>

                    <Input
                        label="Password"
                        id="password"
                        type="password"
                        name="password"
                        value={enteredValues.password}
                        onChange={(event) =>
                            handleInputChange("password", event.target.value)
                        }
                        minLength={8}
                        onBlur={() => handleInputBlur("password")}
                        required
                        error={
                            checkIfPasswordTooShort &&
                            "Password must be at least 8 characters"
                        }
                    />

                    <Input
                        label="Confirm Password"
                        id="confirmedPassword"
                        type="password"
                        name="confirmedPassword"
                        value={enteredValues.confirmedPassword}
                        onChange={(event) =>
                            handleInputChange(
                                "confirmedPassword",
                                event.target.value
                            )
                        }
                        onBlur={() => handleInputBlur("confirmedPassword")}
                        minLength={8}
                        required
                        error={
                            checkIfPasswordsMatch && "Passwords do not match"
                        }
                    />

                    <div className="flex justify-between md:gap-2">
                        <div className={messageStyles}>
                            {afterSubmitMessage.message !== "" ? (
                                <>
                                    <p>{afterSubmitMessage.message}</p>
                                </>
                            ) : undefined}
                        </div>

                        <div className="flex md:gap-2">
                            {loading ? (
                                <Loading2 />
                            ) : (
                                <Button customStyles="primary" type="submit">
                                    Sign Up
                                </Button>
                            )}
                        </div>
                    </div>
                </form>
            </div>
            <div className="flex justify-center items-center">
                <span>Already have an account?</span>
                <Button
                    type="button"
                    customStyles="secondary"
                    onClick={() => handleChangeCurForm("login")}>
                    Sign In
                </Button>
            </div>

            {/* Code for debugging */}
            {/* <button onClick={showMessage}>Show message outcome</button> */}
        </>
    );
};

Register.propTypes = {
    handleChangeCurForm: PropTypes.func,
    fetchedUsernames: PropTypes.array,
};
