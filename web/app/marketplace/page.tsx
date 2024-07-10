"use client";
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

export default function Marketplace() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [items, setCurrentItems] = useState<any[]>();
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [search, setSearch] = useState<string>("");
  const router = useRouter();
  useEffect(() => {
    setUser(setCurrentUser);
  }, []);

  useEffect(() => {
    if (currentUser) {
      let getItems: any[] = [];
      const getFlashcardsQuery = query(collection(db, "flashcards"));
      const getProblemSetsQuery = query(collection(db, "problemsets"));
      let terms: string[] = [];
      getDocs(getFlashcardsQuery).then((res) => {
        if (!res) return;
        res.forEach((doc) => {
          getItems.push({
            title: doc.data().cardsetName,
            classRelatedTo: doc.data().class,
            id: doc.data().docid,
            type: "flashcard",
          });
        });
        console.log(getItems);
        setCurrentItems(getItems);
      });
    }
  }, [currentUser]);

  return (
    <>
      <AppSidebar />
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
            className="text-gradient-black"
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
                style={{ display: "flex", flexDirection: "row", width: "100%" }}
              >
                <TextField
                  style={{
                    borderRadius: 400,
                    width: "90%",
                    marginTop: 40,
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
                  variant="outlined"
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
                          width: "100%",
                          marginBottom: 15,
                          padding: 15,
                          borderRadius: 10,
                        }}
                        onClick={() => {
                          router.push(`/ps/${r.id}`);
                        }}
                      >
                        <i className="fa fa-pencil-square mr-3"></i> {r.title}
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
    </>
  );
}
