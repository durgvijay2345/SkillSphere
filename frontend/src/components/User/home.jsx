import React, { useEffect, useState, useRef } from "react";
import logo from "../../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaGithub,
  FaUserCircle,
} from "react-icons/fa";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../../frontend-config/api";

function Home() {
  const [courses, setCourses] = useState([]);
  const [user, setUser] = useState(null);
  const [purchasedCourses, setPurchasedCourses] = useState([]);
  const [loadingPurchased, setLoadingPurchased] = useState(true);
  const [showProfile, setShowProfile] = useState(false);

  const navigate = useNavigate();
  const profileRef = useRef();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?.user) {
      setUser({ ...storedUser.user, token: storedUser.token });
    }
  }, []);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/course/courses`, { withCredentials: true })
      .then((res) =>
        setCourses(Array.isArray(res.data.courses) ? res.data.courses : [])
      )
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    const fetchPurchased = async () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!storedUser?.token) return;

      try {
        const res = await axios.get(`${BACKEND_URL}/purchase/all`, {
          headers: { Authorization: `Bearer ${storedUser.token}` },
          withCredentials: true,
        });

        setPurchasedCourses(res.data.purchasedCourses || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingPurchased(false);
      }
    };

    fetchPurchased();
  }, []);

  useEffect(() => {
    const closeProfile = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    };

    document.addEventListener("mousedown", closeProfile);

    return () => {
      document.removeEventListener("mousedown", closeProfile);
    };
  }, []);

  const handleLogout = async () => {
    try {
      const res = await axios.post(
        `${BACKEND_URL}/user/logout`,
        {},
        { withCredentials: true }
      );

      toast.success(res.data.message);
      localStorage.removeItem("user");
      setUser(null);
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    arrows: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  return (
    <div className="bg-gradient-to-r from-black to-blue-950 text-white min-h-screen">
      <div className="container mx-auto px-4 py-6">

        {/* Header */}
        <header className="sticky top-0 z-50 bg-black/70 backdrop-blur p-4 rounded-xl flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src={logo} alt="logo" className="w-8 h-8 rounded-full" />
            <h1 className="text-2xl font-bold text-orange-500">
           CourseHaven
            </h1>
          </div>

          {user ? (
            <div className="relative flex items-center gap-4">
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="cursor-pointer"
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt="avatar"
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <FaUserCircle className="text-3xl text-orange-400" />
                )}
              </button>

              <button
                onClick={() => {
                  localStorage.removeItem("user");
                  navigate("/signup");
                }}
                className="bg-green-600 px-4 py-2 rounded-full"
              >
                New Signup
              </button>

              {showProfile && (
                <div
                  ref={profileRef}
                  className="absolute top-14 right-0 bg-white text-black w-72 p-4 rounded-xl shadow-xl"
                >
                  <div className="text-center">
                    <img
                      src={user.avatar || ""}
                      alt=""
                      className="w-20 h-20 rounded-full mx-auto mb-3"
                    />

                    <h3 className="font-semibold text-lg">
                      {user.firstName} {user.lastName}
                    </h3>

                    <p className="text-sm">{user.email}</p>

                    <Link
                      to="/user/setting"
                      className="block mt-4 bg-blue-600 text-white px-4 py-2 rounded-full"
                    >
                      Update Profile
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="mt-2 bg-red-500 text-white px-4 py-2 rounded-full w-full"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex gap-3">
              <Link
                to="/login"
                className="bg-white text-black px-5 py-2 rounded-full"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="bg-orange-500 px-5 py-2 rounded-full"
              >
                Signup
              </Link>
            </div>
          )}
        </header>

        {/* Hero */}
        <section className="text-center mt-20">
          <h1 className="text-5xl font-bold text-orange-500">
            Welcome to DemoAcademy
          </h1>

          <p className="mt-4 text-gray-300 text-lg">
            Learn skills online with premium dummy courses.
          </p>

          <div className="mt-6 flex gap-4 justify-center">
            <Link
              to="/courses"
              className="bg-green-500 px-6 py-2 rounded-full"
            >
              Browse Courses
            </Link>

            <a
              href="https://example.com/demo"
              target="_blank"
              rel="noreferrer"
              className="bg-white text-black px-6 py-2 rounded-full"
            >
              Watch Demos
            </a>
          </div>
        </section>

        {/* Courses */}
        <section className="mt-16">
          <h2 className="text-2xl text-center font-semibold mb-6">
            Popular Courses
          </h2>

          <Slider {...settings}>
            {courses.map((course) => {
              const ids = purchasedCourses.map(
                (item) => item.courseId || item._id
              );

              const isPurchased = ids.includes(course._id);

              return (
                <div key={course._id} className="px-2">
                  <div className="bg-gray-900 rounded-xl p-4">
                    <img
                      src={course.image?.url}
                      alt={course.title}
                      className="h-40 w-full object-contain bg-white rounded-xl"
                    />

                    <div className="text-center mt-4">
                      <h3 className="font-semibold">{course.title}</h3>

                      {loadingPurchased ? (
                        <button className="bg-gray-600 px-4 py-2 rounded-full mt-3">
                          Checking...
                        </button>
                      ) : isPurchased ? (
                        <button
                          onClick={() => navigate("/purchases")}
                          className="bg-green-500 px-4 py-2 rounded-full mt-3"
                        >
                          Enrolled
                        </button>
                      ) : (
                        <Link
                          to={`/buy/${course._id}`}
                          className="inline-block bg-orange-500 px-4 py-2 rounded-full mt-3"
                        >
                          Enroll Now
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </Slider>
        </section>

        {/* Why Choose */}
        <section className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-orange-400 mb-10">
            Why Choose CourseHaven?
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Expert Trainers",
                desc: "Learn from industry professionals.",
              },
              {
                title: "Flexible Learning",
                desc: "Study anytime anywhere.",
              },
              {
                title: "Certificates",
                desc: "Get completion certificates.",
              },
            ].map((item, i) => (
              <div key={i} className="bg-gray-800 p-6 rounded-xl">
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-gray-400 mt-2">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Policies */}
        <section className="mt-20 space-y-6">
          {[
            {
              title: "Contact Us",
              path: "/contact-us",
              desc: "Mail us at support@demoacademy.com",
            },
            {
              title: "Privacy Policy",
              path: "/privacy-policy",
              desc: "Your privacy matters to us.",
            },
            {
              title: "Refund Policy",
              path: "/refund-policy",
              desc: "Easy refund available.",
            },
            {
              title: "Terms & Conditions",
              path: "/terms-and-conditions",
              desc: "Read all terms carefully.",
            },
          ].map((item, i) => (
            <div
              key={i}
              onClick={() => navigate(item.path)}
              className="bg-gray-900 p-6 rounded-xl cursor-pointer"
            >
              <h2 className="text-xl font-bold text-orange-500">
                {item.title}
              </h2>

              <p className="mt-2 text-gray-300">{item.desc}</p>
            </div>
          ))}
        </section>

        {/* Footer */}
        <footer className="mt-20 border-t pt-10 grid md:grid-cols-3 gap-6 text-center md:text-left">

          <div>
            <h2 className="text-xl font-bold text-orange-500">
              DemoAcademy
            </h2>

            <p className="mt-3">Follow us on</p>

            <div className="flex gap-4 mt-3 justify-center md:justify-start">
              <a href="https://example.com/facebook">
                <FaFacebook />
              </a>

              <a href="https://example.com/instagram">
                <FaInstagram />
              </a>

              <a href="https://example.com/twitter">
                <FaTwitter />
              </a>

              <a href="https://example.com/github">
                <FaGithub />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-white">Connect</h3>
            <p>YouTube: YouTube</p>
            <p>Telegram: Instagram</p>
            <p>GitHub: GitHub</p>
          </div>

          <div>
            <h3 className="font-semibold text-white">
              © 2026 CourseHaven
            </h3>
            <p>All rights reserved.</p>
            <p>Designed by My Team</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Home;
