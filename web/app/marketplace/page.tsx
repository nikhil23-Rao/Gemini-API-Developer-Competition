"use client";
import "react-loading-skeleton/dist/skeleton.css";
import React, { useEffect, useState } from "react";
import { AppSidebar } from "../../components/general/Sidebar";
import { Button, TextField } from "@mui/material";
import "../globals.css";
import { setUser } from "@/utils/getCurrentUser";
import { User } from "@/types/auth/User";
import { collection, getDocs, query, where } from "@firebase/firestore";
import db from "@/utils/initDB";
import { getMarketplaceSearchResults } from "@/api/getMarketplaceSearchResults";
import { useRouter } from "next/navigation";
import loader from "../../public/searchLoader.json";
import Lottie from "lottie-react";
import { getTheme } from "@/utils/getTheme";
import { Splash } from "@/components/general/Splash";
import { getColor } from "@/utils/getColor";
import animation from "../../public/loader.json";
import Skeleton from "react-loading-skeleton";

export default function Marketplace() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loadingForYou, setLoadingForYou] = useState(true);
  const [items, setCurrentItems] = useState<any[]>();
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [trending, setTrending] = useState([]);
  const [forYou, setForYou] = useState([]);
  const [search, setSearch] = useState<string>("");
  const router = useRouter();

  const [theme, setTheme] = useState<any>();
  const [color, setColor] = useState<string>();

  useEffect(() => {
    getTheme(setTheme, setColor);
  }, [typeof localStorage]);

  useEffect(() => {
    setUser(setCurrentUser);
  }, []);

  useEffect(() => {
    if (currentUser) {
      let allData: any[] = [];
      let getItems: any[] = [];
      const getFlashcardsQuery = query(collection(db, "flashcards"));
      const getProblemSetsQuery = query(collection(db, "problemsets"));
      let terms: string[] = [];
      getDocs(getFlashcardsQuery).then((res) => {
        if (!res) return;
        res.forEach((doc) => {
          allData.push({
            title: doc.data().cardsetName,
            classRelatedTo: doc.data().class,
            id: doc.data().docid,
            type: "flashcard",
            savedToFolder: doc.data().savedToFolder,
          });
          getItems.push({
            title: doc.data().cardsetName,
            classRelatedTo: doc.data().class,
            id: doc.data().docid,
            type: "flashcard",
          });
        });
        console.log(getItems);
      });

      getDocs(getProblemSetsQuery).then((res) => {
        if (!res) return;
        res.forEach((doc) => {
          allData.push({
            title: doc.data().problemSetName,
            classRelatedTo: doc.data().chosenClass,
            id: doc.data().docid,
            type: "problemset",
            savedToFolder: doc.data().savedToFolder,
          });
          getItems.push({
            title: doc.data().problemSetName,
            classRelatedTo: doc.data().chosenClass,
            id: doc.data().docid,
            type: "problemset",
          });
        });
        console.log(getItems);
        setCurrentItems(getItems);

        allData.sort((a, b) => {
          if (a.savedToFolder.length < b.savedToFolder.length) {
            return -1;
          }
          if (a.savedToFolder.length > b.savedToFolder.length) {
            return 1;
          }
          return 0;
        });
        setTrending(allData.slice(0, 3) as any);
      });
    }
  }, [currentUser]);

  useEffect(() => {
    if (items && items.length > 0 && currentUser) {
      setLoadingForYou(true);
      getMarketplaceSearchResults(
        items as any,
        `${currentUser?.target?.chosenClass}: ${currentUser?.target?.text}`,
      ).then((results) => {
        console.log("JFWEIOJIOFEWJIOWEF", results);
        setForYou(JSON.parse(results).slice(0, 3));
        setLoadingForYou(false);
      });
    }
  }, [items]);

  useEffect(() => {
    console.log("TRENDING", trending);
  }, [trending]);

  useEffect(() => {
    console.log(forYou);
  }, [forYou]);

  if (!theme) return <Splash></Splash>;
  return (
    <>
      <div
        style={{
          height: "100%",
          width: "100%",
          backgroundColor: theme.backgroundColor,
        }}
        className={theme.className}
      >
        <AppSidebar
          modals={false}
          bg={theme.backgroundColor}
          color={theme.textColor}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            marginLeft: "10%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <h1
              className={getColor(color!)}
              style={{ fontSize: "4vw", marginTop: 50 }}
            >
              Explore
            </h1>
            <p
              style={{
                marginTop: 40,
                maxWidth: "55%",
                textAlign: "center",
                color: "gray",
                fontSize: 14,
              }}
            >
              Welcome to the marketplace! Looking for a previously existing
              flashcard set, or maybe you are trying to find some more questions
              for your upcoming exam. Use the AI-Powered search to find what you
              need.
            </p>

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "60%",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                  }}
                >
                  <TextField
                    style={{
                      borderRadius: 400,
                      width: "90%",
                      marginTop: 40,
                      backgroundColor:
                        theme.name !== "Light" ? theme.textColor : "#fff",
                    }}
                    value={search}
                    onChange={(e) => {
                      console.log(e.currentTarget.value);
                      setSearch(e.currentTarget.value);
                      setNoResults(false);
                      setSearchResults([]);
                    }}
                    onKeyDown={async (e) => {
                      if (e.key === "Enter") {
                        setLoading(true);
                        const results = await getMarketplaceSearchResults(
                          items as any,
                          search,
                        );
                        console.log("RES", JSON.parse(results));
                        if (JSON.parse(results).length == 0) {
                          setNoResults(true);
                        }
                        setSearchResults(JSON.parse(results));
                        setLoading(false);
                      }
                    }}
                    placeholder="Search by title, concept, class, etc..."
                    InputProps={{ sx: { borderRadius: 100, paddingLeft: 2 } }}
                  ></TextField>
                  <Button
                    variant="contained"
                    startIcon={<i className="fa fa-sort"></i>}
                    style={{
                      borderRadius: 100,
                      width: 120,
                      height: 50,
                      marginTop: 42,
                      marginLeft: 20,
                    }}
                  >
                    Filters
                  </Button>
                </div>
                {search.length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      justifyContent: "flex-start",
                      textAlign: "left",
                      width: "80%",
                      border: "2px solid #eee",
                      borderRadius: 15,
                      padding: 25,
                      overflowY: "scroll",
                      maxHeight: 250,
                      marginLeft: -130,
                      backgroundColor: "#fff",
                    }}
                  >
                    {loading ? (
                      <>
                        <div
                          style={{
                            alignItems: "center",
                            justifyContent: "center",
                            display: "flex",
                            flexDirection: "column",
                            width: "100%",
                          }}
                        >
                          <Lottie animationData={loader}></Lottie>
                          <p>Querying results...</p>
                        </div>
                      </>
                    ) : search.length > 0 &&
                      searchResults.length <= 0 &&
                      noResults === false ? (
                      <p>Click enter to find results...</p>
                    ) : noResults ? (
                      <>no results found.</>
                    ) : (
                      searchResults.slice(0, 8).map((r) => (
                        <li
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            width: "100%",
                            borderRadius: 10,
                          }}
                          className="hover"
                          onClick={() => {
                            router.push(`/ps/${r.id}`);
                          }}
                        >
                          <li
                            style={{
                              width: "100%",
                              marginBottom: 15,
                              padding: 15,
                              borderRadius: 10,
                            }}
                          >
                            <i
                              className={
                                r.type === "problemset"
                                  ? "fa fa-question-circle mr-3"
                                  : "fa fa-pencil-square mr-3"
                              }
                            ></i>{" "}
                            {r.title}
                            <p
                              style={{
                                marginLeft: 30,
                                textTransform: "uppercase",
                                fontSize: 12,
                              }}
                            >
                              {" "}
                              {r.classRelatedTo}
                            </p>
                          </li>
                          <div style={{ marginTop: 32, marginRight: 20 }}>
                            <i
                              className="fa fa-arrow-right"
                              style={{ zoom: 1.5 }}
                            ></i>
                          </div>
                        </li>
                      ))
                    )}
                    {searchResults.length > 8 ? <p>View All</p> : <></>}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div style={{ marginLeft: "20%", marginTop: 100 }}>
          <h1 className={getColor(color!)} style={{ fontSize: "3vw" }}>
            For You
          </h1>
          <p className="mt-8" style={{ color: theme.textColor }}>
            Based on your current target, and recently created/viewed sets...
          </p>
          <p
            style={{
              textTransform: "uppercase",
              letterSpacing: 2,
              color: theme.textColor,
            }}
          >
            Current Target: {currentUser?.target?.chosenClass} -{" "}
            {currentUser?.target?.text}
          </p>

          {!loadingForYou && forYou.length === 0 ? (
            <>
              <p style={{ marginTop: 10 }}>
                Looks like no sets were found. Try changing your target to get
                better reccomendations
              </p>
            </>
          ) : (
            <></>
          )}
          {loadingForYou && (
            <>
              <p style={{ marginTop: 20, color: theme.textColor }}>
                fetching data...
              </p>
            </>
          )}

          <main className="" style={{ maxWidth: "60%", marginTop: -50 }}>
            <div className="mx-auto w-full max-w-5xl px-4 py-24 md:px-6">
              <div className="mx-auto grid max-w-xs items-start gap-6 lg:max-w-none lg:grid-cols-3">
                {forYou.map((c: any, idx) => (
                  <article
                    className="card__article"
                    style={{
                      cursor: "pointer",
                      border: "2px solid #eee",
                      borderRadius: 10,
                    }}
                  >
                    <img
                      src={`https://api.dicebear.com/8.x/identicon/svg?seed=${
                        idx * 2
                      }`}
                      alt="image"
                      className="card__img"
                      style={{ width: "100%", borderRadius: 0 }}
                    />
                    <div
                      className="card__data"
                      style={{
                        color: "#000",
                        backgroundColor: "#fff",
                      }}
                    >
                      <span
                        className="card__description"
                        style={{ textTransform: "uppercase", color: "gray" }}
                      >
                        {c.classRelatedTo}
                      </span>

                      <h2 className="card__title">{c.title}</h2>
                      <a href={`/ps/${c.id}`} className="card__button">
                        Visit Set
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </main>
          <h1 className={getColor(color!)} style={{ fontSize: "3vw" }}>
            Trending
          </h1>
          <p className="mt-8" style={{ color: theme.textColor }}>
            Based on number of folder saves...
          </p>
          <main className="" style={{ maxWidth: "60%", marginTop: -50 }}>
            <div className="mx-auto w-full max-w-5xl px-4 py-24 md:px-6">
              <div className="mx-auto grid max-w-xs items-start gap-6 lg:max-w-none lg:grid-cols-3">
                {trending.map((c: any, idx) => (
                  <article
                    className="card__article"
                    style={{
                      cursor: "pointer",
                      border: "2px solid #eee",
                      borderRadius: 10,
                    }}
                  >
                    <img
                      src={`https://api.dicebear.com/8.x/identicon/svg?seed=${
                        idx * 2
                      }`}
                      alt="image"
                      className="card__img"
                      style={{ width: "100%", borderRadius: 0 }}
                    />
                    <div
                      className="card__data"
                      style={{ color: "#000", backgroundColor: "#fff" }}
                    >
                      <span
                        className="card__description"
                        style={{ textTransform: "uppercase", color: "gray" }}
                      >
                        {c.classRelatedTo}
                      </span>

                      <h2 className="card__title">{c.title}</h2>
                      <a href={`/ps/${c.id}`} className="card__button">
                        Visit Set
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
