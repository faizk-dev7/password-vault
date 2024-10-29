import { useState } from "react";
import { validateUser } from "../utils/http";
import { useNavigate } from "react-router-dom";
import Input from "./Input";
import { Button } from "./Button";
import { Loading2 } from "./Loading2";

export const Login = ({ handleChangeCurForm }) => {
    const navigate = useNavigate();
    const [loggingIn, setLoggingIn] = useState(false);
    const [afterSubmitMessage, setAfterSubmitMessage] = useState({
        message: "",
        ok: null,
    });
    // const [enteredUsername, setEnteredUsername] = useState(
    //     localStorage.getItem("enteredUsername") !== null
    //         ? localStorage.getItem("enteredUsername")
    //         : ""
    // );
    const [enteredValues, setEnteredValues] = useState({
        username:
            localStorage.getItem("enteredUsername") !== null
                ? localStorage.getItem("enteredUsername")
                : "",
        password: "",
    });
    const [didEdit, setDidEdit] = useState({
        username: "",
        password: "",
    });

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
        setAfterSubmitMessage({
            message: "",
            ok: null,
        });
    }

    function handleSubmit(e) {
        setLoggingIn(true);
        e.preventDefault();
        const fd = new FormData(e.target);
        const formData = Object.fromEntries(fd.entries());
        if (formData.username === "" || formData.password === "") {
            setAfterSubmitMessage({
                message: "Enter username & password",
                ok: false,
            });
            setLoggingIn(false);
            return;
        }

        async function validateFormInput() {
            const token = await validateUser(formData);

            if (!token.ok) {
                setAfterSubmitMessage({ message: token.message, ok: false });
                setLoggingIn(false);
                return;
            }
            localStorage.setItem("token", token.token);
            setTimeout(() => {
                navigate("/dashboard");
                setAfterSubmitMessage({
                    message: "",
                    ok: null,
                });
            }, 200);
        }

        validateFormInput();
    }

    let messageStyles = "text-sm flex items-center font-medium";

    if (!afterSubmitMessage.ok) messageStyles += " text-red-400 ";
    if (afterSubmitMessage.ok) messageStyles += " text-green-500";

    return (
        <>
            <h2 className="text-2xl text-center mb-2">Login into account</h2>
            <div className="flex justify-center mb-4">
                <form
                    onSubmit={handleSubmit}
                    id="login-form"
                    className="sm:px-5 sm:py-3 px-3 py-2 marker:grid gap-2 rounded-md md:w-1/3 w-full 
                    shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]">
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
                    />
                    <Input
                        label="Password"
                        id="password"
                        type="password"
                        name="password"
                        onChange={(event) =>
                            handleInputChange("password", event.target.value)
                        }
                        onBlur={() => handleInputBlur("password")}
                    />
                    <div className="flex justify-between md:gap-2">
                        <div className={messageStyles}>
                            {afterSubmitMessage.message !== "" && !loggingIn ? (
                                <p>{afterSubmitMessage.message}</p>
                            ) : undefined}
                        </div>

                        <div className="flex md:gap-2">
                            {loggingIn ? (
                                <Button
                                    customStyles="primary"
                                    type="submit"
                                    disabled>
                                    Sign In
                                </Button>
                            ) : (
                                <Button customStyles="primary" type="submit">
                                    Sign In
                                </Button>
                            )}
                        </div>
                    </div>
                </form>
            </div>
            <div className="flex justify-center items-center">
                <span>Don&apos;t have an account?</span>
                <Button
                    customStyles="secondary"
                    type="button"
                    onClick={() => handleChangeCurForm("register")}>
                    Sign Up
                </Button>
            </div>
        </>
    );
};
