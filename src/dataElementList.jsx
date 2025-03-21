import React, { useEffect, useState } from "react";

const DataElementList = () => {
    const [dataElements, setDataElements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const username = "admin";
    const password = "district";
    const authHeader = "Basic " + btoa(`${username}:${password}`);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    "https://project.ccdev.org/ictprojects",
                    {
                        headers: {
                            Authorization: authHeader,
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                setDataElements(data.dataElements || []);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <p>Loading data elements...</p>;
    if (error) return <p>Error fetching data: {error}</p>;

    return (
        <div>
            <h2>Data Elements</h2>
            <ul>
                {dataElements.map((element) => (
                    <li key={element.id}>{element.displayName}</li>
                ))}
            </ul>
        </div>
    );
};

export default DataElementList;
