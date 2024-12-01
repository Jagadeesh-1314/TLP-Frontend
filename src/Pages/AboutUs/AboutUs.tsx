import { motion } from 'framer-motion';
import { Users, GraduationCap, School, BookOpen, Code, User } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { loadSlim } from 'tsparticles-slim';
import Particles from 'react-tsparticles';
import { FaInstagram, FaGithub, FaLinkedin } from 'react-icons/fa';
import LeadershipCard from '../../components/Animations/LeadershipCard';
import PartyBackground from '../../components/Animations/PartyBackground';


const leadershipTeam = [
    {
        name: 'G.R. Ravinder Reddy',
        role: 'Chairman',
        image: '/chairman.jpg',
        icon: School,
        description: 'Guiding our institution with visionary leadership and strategic direction towards excellence in education.'
    },
    {
        name: 'Dr. Udaya Kumar',
        role: 'Principal',
        image: '/principal.png',
        icon: School,
        description: 'Ensuring academic excellence and fostering an environment of innovation and growth.'
    },
    {
        name: 'Prof V. Madhusudhan Rao',
        role: 'Dean',
        image: '/dean.jpg',
        icon: GraduationCap,
        description: 'Leading academic initiatives and promoting research excellence across departments.'
    },
    {
        name: 'Dr. Sree Lakshmi',
        role: 'HOD',
        image: '/hod.jpg',
        icon: BookOpen,
        description: 'Driving departmental excellence and curriculum innovation to prepare future leaders.'
    },
    {
        name: 'Dr. Srihari',
        role: 'IQAC',
        image: '/srihari.jpg',
        icon: Users,
        description: 'Driving departmental excellence and curriculum innovation to prepare future leaders.'
        // socials: {
        //     instagram: "https://instagram.com/username1",
        //     github: "https://github.com/username1",
        //     linkedin: "https://linkedin.com/in/username1",
        // },
    },
];

const facultyCoordinators = [
    {
        name: 'Sr. Asst Mahender',
        image: '/mahender.jpg',
        icon: Users,
        socials: {
            instagram: "https://instagram.com/username1",
            github: "https://github.com/username1",
            linkedin: "https://linkedin.com/in/username1",
        },
    },
];

const studentDevelopers = [
    {
        name: "T Jagadeesh Chandra",
        role: "Student Developer",
        image: '/Arya.png',
        icon: Code,
        socials: {
            instagram: "https://instagram.com/username1",
            github: "https://github.com/Jagadeesh-1314",
            linkedin: "https://linkedin.com/in/username1",
        },
    },
    {
        name: "B Vignesh",
        role: "Student Developer",
        image: '/principal.png',
        icon: Code,
        socials: {
            instagram: "https://instagram.com/username1",
            github: "https://github.com/username1",
            linkedin: "https://linkedin.com/in/username1",
        },
    },
    {
        name: "R Harinath Reddy",
        role: "Student Developer",
        image: '/harinath.jpg',
        icon: Code,
        socials: {
            instagram: "https://instagram.com/username1",
            github: "https://github.com/username1",
            linkedin: "https://linkedin.com/in/username1",
        },
    },
    {
        name: "Y Rahul",
        role: "Student Developer",
        image: '/principal.png',
        icon: Code,
        socials: {
            instagram: "https://instagram.com/username1",
            github: "https://github.com/username1",
            linkedin: "https://linkedin.com/in/username1",
        },
    },
    {
        name: "P Sai Shiva Kumar",
        role: "Student Developer",
        image: '/shiva.jpg',
        icon: Code,
        socials: {
            instagram: "https://www.instagram.com/sai_shiva_0627/?igsh=a3ZpMDM0a3NnMjB5#",
            github: "https://github.com/shiva0890",
            linkedin: "https://www.linkedin.com/in/sai-shiva-kumar-pedda-0113b2313?trk=contact-info",
        },
    },
    {
        name: "Y Santhosh Anand",
        role: "Student Developer",
        image: '/santhosh.png',
        icon: Code,
        socials: {
            instagram: "https://instagram.com/username1",
            github: "https://github.com/username1",
            linkedin: "https://linkedin.com/in/username1",
        },
    },
];

const teamMembers = [
    {
        name: "Team Member 1",
        role: "Development Team",
        image: '/principal.png',
        icon: User,
        socials: {
            instagram: "https://instagram.com/username1",
            github: "https://github.com/username1",
            linkedin: "https://linkedin.com/in/username1",
        },
    },
    {
        name: "Team Member 2",
        role: "Development Team",
        image: '/principal.png',
        icon: User,
        socials: {
            instagram: "https://instagram.com/username1",
            github: "https://github.com/username1",
            linkedin: "https://linkedin.com/in/username1",
        },
    },
    {
        name: "Team Member 3",
        role: "Development Team",
        image: '/principal.png',
        icon: User,
        socials: {
            instagram: "https://instagram.com/username1",
            github: "https://github.com/username1",
            linkedin: "https://linkedin.com/in/username1",
        },
    },
    {
        name: "Team Member 4",
        role: "Development Team",
        image: '/principal.png',
        icon: User,
        socials: {
            instagram: "https://instagram.com/username1",
            github: "https://github.com/username1",
            linkedin: "https://linkedin.com/in/username1",
        },
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.3
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.5,
            ease: "easeOut"
        }
    }
};

const floatingAnimation = {
    y: ['-10px', '10px'],
    transition: {
        y: {
            duration: 2,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut'
        }
    },
};


function SocialMediaIcons({ socials }: { socials: any }) {
    return (
        <div className="flex justify-center space-x-4 mt-4">
            {socials.instagram && (
                <a href={socials.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-500 hover:text-pink-700 transition duration-200">
                    <FaInstagram size={24} />
                </a>
            )}
            {socials.github && (
                <a href={socials.github} target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:text-black transition duration-200">
                    <FaGithub size={24} />
                </a>
            )}
            {socials.linkedin && (
                <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 transition duration-200">
                    <FaLinkedin size={24} />
                </a>
            )}
        </div>
    );
}


const Underline = ({ width }: { width: number }) => {
    const [isVisible, setIsVisible] = useState(false);
    const underlineRef = useRef(null);

    const responsiveWidth = `${width}%`;

    const underlineVariants = {
        hidden: { width: 0 },
        visible: {
            width: responsiveWidth,
            transition: { duration: 0.5, ease: 'easeOut' }
        }
    };

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            });
        });

        if (underlineRef.current) {
            observer.observe(underlineRef.current);
        }

        return () => {
            if (underlineRef.current) {
                observer.unobserve(underlineRef.current);
            }
        };
    }, []);

    return (
        <motion.div
            ref={underlineRef}
            className="h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto mb-8"
            variants={underlineVariants}
            initial="hidden"
            animate={isVisible ? 'visible' : 'hidden'}
            style={{ height: '4px' }}
        />
    );
};

export default function AboutUs() {
    const [showWelcome, setShowWelcome] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowWelcome(false);
        }, 3000);

        return () => {
            clearTimeout(timer);
        };
    }, []);

    const particlesInit = async (engine: any) => {
        await loadSlim(engine);
    };

    return (
        <>
            {showWelcome ? (
                <>
                    {/* Particles Background */}
                    <Particles
                        id="tsparticles"
                        init={particlesInit}
                        options={{
                            particles: {
                                number: {
                                    value: 100,
                                    density: {
                                        enable: true,
                                        value_area: 800
                                    }
                                },
                                color: {
                                    value: ["#FF69B4", "#4B0082", "#9370DB", "#FFD700", "#FF6347"],
                                },
                                shape: {
                                    type: "circle"
                                },
                                opacity: {
                                    value: 0.6,
                                    random: true
                                },
                                size: {
                                    value: 4,
                                    random: true
                                },
                                move: {
                                    enable: true,
                                    speed: 3,
                                    direction: "none",
                                    random: true,
                                    straight: false,
                                    outModes: {
                                        default: "bounce"
                                    }
                                }
                            },
                            interactivity: {
                                detectsOn: "canvas",
                                events: {
                                    onHover: {
                                        enable: true,
                                        mode: "repulse"
                                    },
                                    resize: true
                                }
                            },
                            background: {
                                opacity: 0
                            }
                        }}
                        className="absolute inset-0 pointer-events-none" />
                    <motion.div
                        className="absolute inset-0 flex items-center justify-center text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 mb-4 sm:text-5xl md:text-6xl"
                        initial={{ opacity: 0, x: '-100%' }}
                        animate={{ opacity: 1, x: '0%' }}
                        transition={{ duration: 0.5 }}
                        exit={{ opacity: 0, x: '100%' }}
                    >
                        Welcome to Meet Our Team
                    </motion.div>
                </>
            ) : (

                <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                    <PartyBackground />

                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                        className="max-w-7xl mx-auto relative z-10"
                    >
                        <motion.div
                            variants={itemVariants}
                            className="text-center mb-16"
                            animate={floatingAnimation}
                        >
                            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                                About Us
                            </h1>
                            <Underline width={50} />
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                Meet the visionary leaders shaping our institution's future
                            </p>
                        </motion.div>

                        <motion.div variants={containerVariants} className="grid grid-cols-1 gap-12 lg:grid-cols-2 mb-20">
                            {leadershipTeam.map((leader) => (
                                <motion.div
                                    key={leader.role}
                                    variants={itemVariants}
                                    whileHover={{
                                        scale: 1.05,
                                        transition: { duration: 0.2 }
                                    }}
                                >
                                    <LeadershipCard {...leader} />
                                </motion.div>
                            ))}
                        </motion.div>

                        <motion.div variants={itemVariants} className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                                Faculty Coordinators
                            </h2>
                            <Underline width={30} />
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-8s">
                                {facultyCoordinators.map((coordinator, index) => (
                                    <motion.div
                                        key={coordinator.name}
                                        whileHover={{ scale: 1.05 }}
                                        // animate={floatingAnimation}
                                        transition={{ delay: index * 0.1 }}
                                        className="bg-white rounded-xl shadow-lg p-6"
                                    >
                                        <div className="relative mb-4">
                                            {/* <div className="absolute inset-0 bg-gradient-to-r from-purple-300 to-pink-300 rounded-full opacity-10 animate-pulse" /> */}
                                            <img
                                                src={coordinator.image}
                                                alt={coordinator.name}
                                                className="w-36 h-36 mx-auto rounded-full object-cover border-4 border-white shadow-lg"
                                            />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900">{coordinator.name}</h3>
                                        {/* <coordinator.icon className="w-5 h-5 mx-auto text-gray-500 mt-2" /> */}
                                        <SocialMediaIcons socials={coordinator.socials} />
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>


                    <motion.div variants={itemVariants} className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                            Student Developers
                        </h2>
                        <Underline width={30} />
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                            {studentDevelopers.map((developer, index) => (
                                <motion.div
                                    key={index}
                                    whileHover={{ scale: 1.1 }}
                                    // animate={floatingAnimation}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white rounded-xl shadow-md p-4 z-10"
                                >
                                    <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                                        <img src={developer.image} alt={developer.name} className="w-full h-full object-cover" />
                                    </div>
                                    <h4 className="text-sm font-medium text-gray-900">{developer.name}</h4>
                                    <p className="text-xs text-gray-600">{developer.role}</p>
                                    <SocialMediaIcons socials={developer.socials} />
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="text-center">
                        <h2 className="text-3xl font-bold text-gray-900 mb-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                            Development Team
                        </h2>
                        <Underline width={30} />
                        <div className="bg-white rounded-xl shadow-xl p-8">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 z-10">
                                {teamMembers.map((member, index) => (
                                    <motion.div
                                        key={index}
                                        whileHover={{ scale: 1.1 }}
                                        animate={floatingAnimation}
                                        transition={{ delay: index * 0.1 }}
                                        className="text-center"
                                    >
                                        <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden">
                                            <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                                        </div>
                                        <h4 className="text-lg font-medium text-gray-900">{member.name}</h4>
                                        <p className="text-sm text-gray-600">{member.role}</p>
                                        <SocialMediaIcons socials={member.socials} />
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </>
    );
}
