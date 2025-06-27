// Function to get color from the first letter
export const getColorFromLetter = (char) => {
    const colors = [
        "bg-red-500",
        "bg-green-500",
        "bg-blue-500",
        "bg-yellow-500",
        "bg-purple-500",
        "bg-pink-500",
        "bg-indigo-500",
        "bg-emerald-500",
        "bg-rose-500",
        "bg-teal-500",
        "bg-orange-500",
        "bg-lime-500",
    ];

    // Map A-Z to index 0-25
    const index = (char.toUpperCase().charCodeAt(0) - 65) % colors.length;
    return colors[index];
};