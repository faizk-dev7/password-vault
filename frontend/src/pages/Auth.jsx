import { useEffect, useState } from "react";
import {
    fetchUsernames as fetchUsernames,
    handleFetchDivisions,
} from "../utils/http.js";
import { Login } from "../components/Login.jsx";
import { Register } from "../components/Register.jsx";
import { Loading } from "../components/Loading.jsx";
import { Error } from "../components/Error.jsx";

export default function Auth() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({ message: "" });
    const [usernames, setUsernames] = useState([]);
    const [curSelectedForm, setCurSelectedForm] = useState("login");
    const [fetchedDivisions, setFetchedDivisions] = useState([]);

    useEffect(() => {
        setLoading(true);
        try {
            const getUsernames = async () => {
                const fetchedUsernames = await fetchUsernames();
                console.log(fetchedUsernames);
                if (!fetchedUsernames.ok) {
                    setError({ message: fetchedUsernames.message });
                    setLoading(false);
                    return;
                }
                const divisions = await handleFetchDivisions();
                console.log(divisions);
                console.log("-===-");

                setFetchedDivisions(divisions);
                setUsernames(fetchedUsernames.usernames);
                setLoading(false);
            };

            getUsernames();
        } catch (err) {
            setError({
                message: err.message || "Error!! Please try again later",
            });
            setLoading(false);
        }
    }, []);

    function changeCurForm(form) {
        setCurSelectedForm(form);
    }

    // code for debugging
    // function showUsers() {
    //     console.log(usernames);
    // }

    return (
        <div className="">
            {loading ? (
                <Loading loadingMessage="Loading..." />
            ) : error.message === "" ? (
                <>
                    {curSelectedForm === "login" ? (
                        <Login handleChangeCurForm={changeCurForm} />
                    ) : (
                        <Register
                            fetchedUsernames={usernames}
                            handleChangeCurForm={changeCurForm}
                            fetchedDivisions={fetchedDivisions}
                        />
                    )}
                </>
            ) : (
                <Error>{error.message}</Error>
            )}
        </div>
    );
}
