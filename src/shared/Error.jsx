import React from "react";

const Error = ({ message }) => {
    const styles = {
        container: {
            width: "100%",
            textAlign: "center",
            margin: "10px",
        },
        text: {
            color: "red",
            fontWeight: "bold",
        },
    };

    return (
        <div style={styles.container}>
            <p style={styles.text}>{message}</p>
        </div>
    );
};

export default Error;
