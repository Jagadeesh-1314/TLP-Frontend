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
        name: 'Sri G.R. Ravinder Reddy',
        role: 'Secretary',
        image: '/chairman.jpg',
        icon: School,
        description: 'Guiding our institution with visionary leadership and strategic direction towards excellence in education.'
    },
    {
        name: 'Dr. Udaya Kumar Susarlla',
        role: 'Principal',
        image: '/principal.png',
        icon: School,
        description: 'Ensuring academic excellence and fostering an environment of innovation and growth.'
    },
    {
        name: 'Dr. V. Madhusudhan Rao',
        role: 'Dean (CSI)',
        image: '/dean.jpg',
        icon: GraduationCap,
        description: 'Leading academic initiatives and promoting research excellence across departments.'
    },
    {
        name: 'Dr. A. Sree Lakshmi',
        role: 'HOD(CSE)',
        image: '/hod.jpg',
        icon: BookOpen,
        description: 'Driving departmental excellence and curriculum innovation to prepare future leaders.'
    },
    {
        name: 'Dr. P. Srihari',
        role: 'IQAC Co-Ordinator',
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
        image: '/vignesh.jpg',
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
        image: '/rahul.jpg',
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
        image: 'data:image/jpeg;base64,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',
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
        image: 'data:image/jpeg;base64,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',
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
        image: 'data:image/jpeg;base64,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',
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
        image: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxASEA8REBAREhIQEBYVGBAPEhIPEBESFRIWFhYSFRMYHSggGBolGxUWITIhJSkrLi4uGB8zODMuNyguLisBCgoKDg0OGhAQGy0lIB8tLS0rLS0tKy0tLi0vLS0tLSstLS0xLS0tLS0rLSstLS0tLS0tLTUtKzctLS0xMS0tMf/AABEIAOEA4QMBIgACEQEDEQH/xAAcAAEAAgIDAQAAAAAAAAAAAAAABQcEBgIDCAH/xABIEAACAQICBQcHCAgEBwAAAAAAAQIDEQQFBhIhMUEHEyJRYXGBFkJUkZKh0hQjMlJzgrHBJFNicqKy0eEIM/DxJUNEk7PC0//EABoBAQADAQEBAAAAAAAAAAAAAAABAwQCBQb/xAApEQEBAAIBAwMDAwUAAAAAAAAAAQIRAwQhQRITMQVRYXHh8AZCobHB/9oADAMBAAIRAxEAPwC8QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA669aMIynOUYRiruU2oxiutt7EgOwFb6Rcs+V4dyhRdTFzWz5hJUr/AGsrJrtipGj4/l/xT/yMDQp/a1Klf+XUA9AA82rl2za/+Vgn2c1V/wDoTmVcv87xWKwMWuM8NUcWu1U5p39pAXsDVtE9P8uzCyw9dKq1f5PWXNV112i9kvutm0gAAAAAAAAAAAAAAAAAAAAAAAAAAAAPkgNc0y01weWU1PEzevO+pQp2lVqW4pcF+07I826d6fYvM6rdSTp4dPoYWDfNxXBz+vPtfhYitLM/q4/GV8VVbbqTerFvZTpp9CmlwSVve+JDgfT4AAAAHKnNxalFtSi01JOzTW1NPgy8eSnlalKVPBZnUu5NRpYub234U6z433Kfr6yjAB7jQKw5C9Mp43CzwtdylXwailUltdSjK6hrP60bavarPa7lngAAAAAAAAAAAAAAAAAAAAAAAADT+VzM54bJsdUptxnKEaaknZrnakacmnwerKRuBX/Lsv8AgmJ+0o/+aIHmzIsnrYvEU8PQjrTqO23ZGKW2U5PhFLaS+lGgmPwLk6tJzpL/AKijedK3XLjD7yRYvINk0Y0MTjJR6dWfMwb3qnBKUrPtk17CLWKM+b05aaePg9WO3j6x8PTuc6B5ZiW5VcJTjNu/OUb0JN9b1LJvvTNWxfItgm26eJxMOyXN1EvcmTObFzenziiwXQuRGlfbjqluyhFP+ckMFyM4CLTqVsTV/ZvCnF+qN/eTebBE4M/sog78XgqtJxVWlUpucdaKqQlByi3skrratj2np3JdD8vwjTw+FpRmt1SS52qu6c7teFjWeW7JVWwCxCXzmEmndK7dKo1Ga9epLwZE5pbp1l09mO2f/h1dN5ZWcYRjNYycZyX0qiVOnKDb7FJpL+papTv+Gyp+iY6P1cTB+1Tt/wCpcRczgAAAAAAAAAAAAAAAAAAAAAAABo/LXRc8jx1t8eal4RxFO/uubwazykx1srx1NLWlVw84xit7lquSt6gSbazyW4PmspwSe+cJVP8AuTlJe5o2sx8uwio0aNGO6jShTXdCKj+RkGDK7tr1MJrGQABy6AAAMLOsCsRhsRQlurUZw9qLSfrM0ExFm4r/APw30XHC5g2rfpMY26nGntX8RcJovJhl3yd5pT3a+ZVasfspxhq+rab0b5dvLs1dAAJQAAAAAAAAAAAAAAAAAAAAABrulNS06C4K78bo2Iis/wAA6sE47Zw2pdae9d+w45JvHss47JlLWGDhRleMb77bU9jT4nMxPRAAQkAAAAMIdGUz/THbimn4RX5o2ggsgwMlKVaatrX1U99m76xOm3ilmLz+ay5dgAFioAAAAAAAAAAAAAAAAAAAAAAABFZpTtJS+svejDJnG0daLXFbV3kMY+bHWW2/gz3jr7AAKl4AAB34KnrTj2bfUdDJTLKNo63GX4FnFjvJVzZ+nFmoAG15wAAAAAAAAAAAAAAAAAAAAAAAAAABr2IrLnqsN2q1btvFN+9sn5zSV2apnOGkpyrRvtd3bfF7vUVc03iu4MtZMwGHhsdGWyXRfuf9DMMjfKAGNiMZGPG76l+bIHZWrqOrffKSVvHazZUjTMJh51p60naKe/u81G4Uaqkr+418OOoxdRluyOwAFzOAAAAAAAAAAAAAAAAAAAAAABDZlpPhKN1KqpSXmUvnJX6nbYvFomTfwbTJ04vF06UXOrOFOC3ynJQivFlfaQcoVTm2sNT5ttpKpUalJd0LWT8WV9jsfWrS161WdSXXOTlbuW5LsR3OO+XFznhe08QppSi7xaTTW1NNXTOBqHJzm/OUHh5Pp0Po33uk93svZ3OJt5xZq6dS7m0HmeXat5wXR4r6v9iOTfBm2kHmeXat5wXR4r6v9jNycfmNfFy77VHOT62ZeX4F1HfdBb319iGX4F1Hd7ILe+vsRsMIKKSSsluSI4+Pfep5eXXafJTgopKKslwR2UptO6/3OBAabZv8nwstV2qVuhC29XXSn4L3tGqTfZkt8tqwGYUa0dajUhUSdm4SUrPqdtzMo86YXETpSU6U5U5LdKnJwl61wN70b0/rxi44mPP2a6aapzStxsrS9x3eO+HEznlaAILLtLcHWsuc5uT82stT+L6PvJxSurrbfqOLLPl1Lt9ABCQAAAAAAAAAAAAAIXP9I6OFVpdOo1dUovb3yfmo46V56sLS6NnVqXUIvcuub7F+LRVVarKcpTnJylJ3cpbW31st4+P1d6rzz18JXN9JMTiLqU9SD/5VPoxt2vfLxIcA0SSfCm3bDzOWyK7b+pf3I8matKMvpK5H4zDxjazd3wf4kVMd+Q5m8NiKdZXtF2kl51N7JL1be9IumlUUoxlFpxkk01uaaumihiy+TjN+coyw8n06G2N97pN7vuvZ3OJTyY+VmF8NwInSHOY4anwlUmnqwe796X7P4kvqSaeqk2k7Xdle2xN95VOaVKsq1R1785rNST81rzUupHfTcM5Mu/hg+qdbl03HPTO+Xn7fu3HRPPlViqNSyqRWx2SVSK7Fs1lx9fWbIVDTk4tSi2nF3TWxprc0y1MonVnh6NStFRlON3b3Nrg2rO3addVwTC+rH4qr6T12XPjePPvcfP4/P5ZZUGmeb/KcVJxd6dLoQ6mk+lPxfuSN904zf5PhZKLtUr3hG29Jrpz8F72ipSnjx8vVzvgMzLJbZLrX4P8AudWEoxk2m33LiSNKhGO5eO9l8VV2EjlWeYjDtc1Uer+rl0qb+7w8LMjgTZtEulpaO6V0sTaEvmq31G7xn+5Lj3b+82IoxO21bGuK2NPruWXoVpC8RB0qr+epq9/1kN2t3rc/Bmfk49d4uwz32raAAVLAAAAAAAAAA6cXV1KdSf1YSl6k2BVOlmYOvi6rv0YPm4rhqxdm/F3fiQ4uDbJqaZbdgAJAiMTNuTvwdrdSRLmBmNLapLjsffwIpGEZ+RZlLDYilWjdqL6UV50HslH1e9IwAc2bdPROElB04yg1KM4qSkt0k1dP1FTZriOcr1p/WqSa7tZ291ia0A0j/QsRQnLp4WnKcL73Td9n3ZO33omt2L+hw1cq8H+oOXc48P1v8/y+Fs5FNTwuHb40Yp96ST/AqY2PG6QcxlEIRl87WlOlG2+MdZuc/CMku+SLOux3hL+Wb6Bnrmyx+8/1Wp6ZZv8AKcXNxd6VP5un1OKe2f3nd91iDAMcmo+nt25U5tNNb0TSIzAUryu90fx4EmdxzQAEgZeVY6VCtSrR8ySbXXHdKPirmICNbJV5Qkmk07pq9+tM5EXoxW18HhpP9VFez0fyJQxVqgAAAAAAAAR+kE7YTFPqoVP5GSBE6VytgsV9k169n5kz5RfhUIANrMHGpO1u2SXrORi5hKyh+9f1EDKONSCkmnxOVwSIScWm096PhnZjS3SXc/yZgnDp3YTESpy1otrZZ24xe9Mn4yTSa3NXNaJbKa94uD3x3d3+/wCJp6bPV9N8vD+tdN6+Ocs/t+f0Z5CZhiXOW96sbqK4Lra7/wChI5lX1YWW+Wzw4v8A11kIddVn39Kv6H02pea+e0/6BIGXl9K71nuj+JkfQM3D0tWKXr7zsAOnLjGd3JdVvejkYmFnepU7/wANhlgAASLW0HnfA0OzXXqqSJ41rk+lfBRXVUmv4r/mbKY8vmtOPwAA5SAAAAABFaUYapUwlenSjrTkklFNK/TV9/ZclQTLoqpfJXHejy9qn8Q8lMd6PL2qfxFtAs96q/bipfJTHejy9qn8Rh4/RDMJaurhpO1/PpfEXMBeWntxUVHRTH6sb4aSdl59P4jn5KY70eXtU/iLaA96ntxUc9Esc008PKz/AGqfxEXLQrMrv9Fk+3Xpbf4i8AReWp9uKO8i8y9En7dL4jsw+iGZxkpLCT2P69LauK+kXaCZy2XbnPhxyxuN+KpbHaJZlObfyWdlsXTpbuv6Rj+RWZeiS9ul8ReIGXNlld1HHwYceEwx+Io7yKzL0SXt0viJOjohjoxS+Ty2ftU9/tFvAictjv24qXyUx3o8vap/EfHorj/R5e1T+ItsE+9Ue3FLYLQ/MVJuWFkrrfr0uv8AeM/yUx3o8vap/EW0BOWntxUvkpjvR5e1T+IeSmO9Hl7VP4i2gPep7ca/oTgatHDOFaDhLnZOzaexqO3Y32mwAFdu7t3JqaAAQkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH//Z',
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
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
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
