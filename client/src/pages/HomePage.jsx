import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import { debounce } from "lodash";

function HomePage() {
    const [trips, setTrips] = useState([]);
    const [search, setSearch] = useState("");

    async function getTripsData(str) {
        try {
            const res = await axios.get(`http://localhost:4001/trips?keywords=${str}`);
            setTrips(res.data.data)
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        getTripsData(search);
    }, [])

    const debouncedGetBookData = useCallback(
        debounce((str) => {
            getTripsData(str);
        }, 500),
        []
    );

    function handleSearch(e) {
        const value = e.target.value;
        setSearch(value);
        debouncedGetBookData(value);
    }

    function handleTagSearch(str) {
        str = str.trim();

        if (!search.includes(str)) {
            let strSearch = search + " " + str;
            strSearch = strSearch.trim();

            setSearch(strSearch);
            getTripsData(strSearch);
        }
    }

    function copyToClipboard(text) {
        try {
            navigator.clipboard.writeText(text);
            alert('Copy link to clipboard!');
        } catch {
            alert('Failed to copy!');
        }
    }

    function truncateText(text) {
        const maxLength = 100;
        if (text.length > maxLength) {
            return text.substring(0, maxLength) + '...';
        }
        return text;
    }

    return (
        <div className="m-10 select-none">
            <header className="flex flex-col justify-center items-center ">
                <h1
                    className="text-5xl text-blue-500">
                    เที่ยวไหนดี
                </h1>
                <div className="flex flex-col m-10 w-3/4">
                    <label htmlFor="search">
                        ค้นหาที่เที่ยว
                    </label>
                    <input
                        className="bg-transparent border-0 border-b-2 border-gray-200
                            focus:outline-none focus:border-blue-400
                            placeholder:text-gray-400
                            text-gray-700 text-center"
                        id="search"
                        name="search"
                        placeholder="หาที่เที่ยวแล้วไปกัน ..."
                        value={search}
                        onChange={(e) => handleSearch(e)}>
                    </input>
                </div>
            </header >

            <section>
                {trips.map((item) => {
                    return (
                        <div key={item.eid} className="flex justify-center items-center gap-10 mb-15">
                            <div >
                                <img
                                    className="w-90 h-65 rounded-3xl"
                                    src={item.photos[0]}
                                    alt={item.photos[0]}
                                />
                            </div>

                            <div className="w-190">
                                <div >
                                    <a href={item.url} target="_blank" rel="noopener noreferrer">
                                        <h1
                                            className="text-2xl font-bold mb-3">
                                            {item.title}
                                        </h1>
                                    </a>
                                    <p
                                        className="text-gray-500">
                                        {truncateText(item.description)}
                                    </p>
                                    <a href={item.url} target="_blank" rel="noopener noreferrer">
                                        <button
                                            className="text-blue-500 underline hover:text-blue-400 cursor-pointer">
                                            อ่านต่อ
                                        </button>
                                    </a>
                                </div>

                                <div className="flex flex-wrap gap-3 mb-3 text-gray-500">
                                    <span>หมวด</span>
                                    {
                                        item.tags.map((tag, index) => {
                                            return (
                                                <div key={tag} className="flex gap-3">
                                                    {
                                                        item.tags.length > 1 &&
                                                        index == item.tags.length - 1 &&
                                                        <span >และ</span>
                                                    }

                                                    <button
                                                        className="underline hover:text-blue-400 cursor-pointer"
                                                        onClick={() => { handleTagSearch(tag) }}
                                                    >
                                                        {tag}
                                                    </button>
                                                </div >
                                            )
                                        })
                                    }
                                </div>

                                <div className="flex justify-between items-end">
                                    <div className="flex gap-7">
                                        {
                                            item.photos.map((photo, index) => {
                                                return (
                                                    index > 0 &&
                                                    <div key={index}>
                                                        < img
                                                            className="w-30 h-30 rounded-xl"
                                                            src={photo}
                                                            alt={photo}
                                                        />
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                    <button
                                        className="flex items-center justify-center
                                            w-12 h-12 bg-white border-2 border-blue-200 rounded-full
                                            hover:border-blue-300 hover:bg-blue-50
                                            text-blue-500 cursor-pointer"
                                        onClick={() => { copyToClipboard(item.url) }}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </section>
        </div >
    )
}

export default HomePage;