'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import ThemeSwitch from '@/components/theme-switch';
import AudioToggle from '@/components/audio-toggle';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  FaGithub,
  FaArrowLeft,
  FaDatabase,
  FaCode,
  FaHome,
  FaBrain,
  FaServer,
  FaPython,
  FaNodeJs,
  FaClipboardList,
  FaLightbulb,
} from 'react-icons/fa';
import {
  SiNextdotjs,
  SiTailwindcss,
  SiFastapi,
  SiVercel,
} from 'react-icons/si';

export default function AboutPage() {
  return (
    <main className="relative container mx-auto flex min-h-screen flex-col items-center px-3 py-4 md:px-4 md:py-8">
      <div className="pointer-events-none absolute top-0 left-1/4 h-[400px] w-1/2 bg-gradient-to-b from-purple-600/30 via-fuchsia-500/15 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute top-0 right-[10%] h-[350px] w-[400px] bg-gradient-to-b from-orange-500/30 via-pink-500/15 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute top-0 left-[10%] h-[350px] w-[400px] bg-gradient-to-b from-blue-600/30 via-indigo-500/15 to-transparent blur-3xl" />

      {/* Header */}
      <div className="relative mb-6 w-full md:mb-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-center"
        >
          <Link href="/" className="absolute top-1 left-0">
            <Button variant="ghost" size="icon" className="rounded-full">
              <FaArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back to home</span>
            </Button>
          </Link>
          <h1 className="from-primary to-accent-foreground bg-gradient-to-r bg-clip-text text-center text-4xl font-bold text-transparent md:text-5xl">
            About Signalyze
          </h1>
          <div className="absolute top-1 right-0 flex space-x-2">
            <ThemeSwitch />
            <AudioToggle />
          </div>
        </motion.div>
      </div>

      {/* Main content area */}
      <div className="w-full max-w-4xl">
        {/* Hero section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="mb-8 overflow-hidden border-2 p-6 shadow-lg md:p-8">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col items-center md:flex-row md:items-start">
                <div className="flex-1">
                  <h2 className="mb-4 text-3xl font-bold">Signalyze</h2>
                  <p className="text-muted-foreground mb-4 text-lg">
                    <strong>Signalyze</strong> is a traffic sign recognition
                    system designed specifically for Indian roads. It uses
                    computer vision and deep learning to detect and classify
                    traffic signals into 37 predefined classes in real time.
                  </p>
                  <p className="mb-4">
                    Once a traffic sign is recognized, the system provides an
                    audio response, assisting drivers in navigating the busy
                    roadways of India.
                  </p>
                </div>
              </div>

              <div>
                <Badge variant="outline" className="mb-2 text-sm">
                  YOLO v8 Model
                </Badge>
                <p>
                  The system has been trained on labelled{' '}
                  <strong>Indian Road Traffic Sign Detection dataset</strong>{' '}
                  and uses a YOLO v8 (small) model, achieving a mAP (mean
                  Average Precision) of 82% (ranging from 50% to 95% across
                  various classes).
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Table of Contents */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Card className="mb-8 overflow-hidden border p-6 shadow-md md:p-8">
            <h2 className="mb-4 text-2xl font-semibold">Table of Contents</h2>
            <div className="grid gap-2 md:grid-cols-2">
              <Link href="#tech-stack">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                >
                  <FaCode className="h-4 w-4" />
                  Tech Stack
                </Button>
              </Link>
              <Link href="#getting-started">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                >
                  <FaHome className="h-4 w-4" />
                  Getting Started
                </Button>
              </Link>
              <Link href="#contributing">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                >
                  <FaGithub className="h-4 w-4" />
                  Contributing
                </Button>
              </Link>
              <Link href="#contact">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                >
                  <FaClipboardList className="h-4 w-4" />
                  License & Contact
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>

        {/* Tech Stack */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          id="tech-stack"
          className="scroll-mt-16"
        >
          <Card className="mb-8 overflow-hidden border p-6 shadow-md md:p-8">
            <div className="mb-4 flex items-center gap-2">
              <FaCode className="text-primary h-5 w-5" />
              <h2 className="text-2xl font-semibold">Tech Stack</h2>
            </div>
            <Separator className="mb-6" />

            <div className="grid gap-6 md:grid-cols-3">
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <SiNextdotjs className="text-primary h-5 w-5" />
                  <h3 className="text-xl font-medium">Frontend</h3>
                </div>
                <ul className="space-y-2 pl-4">
                  <li className="flex items-center gap-2">
                    <SiNextdotjs className="h-4 w-4" />
                    <a
                      href="https://nextjs.org/"
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-primary hover:underline"
                    >
                      Next.js
                    </a>
                  </li>
                  <li className="flex items-center gap-2">
                    <SiTailwindcss className="h-4 w-4" />
                    <a
                      href="https://tailwindcss.com/"
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-primary hover:underline"
                    >
                      TailwindCSS
                    </a>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-lg">⬚</span>
                    <a
                      href="https://ui.shadcn.com/"
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-primary hover:underline"
                    >
                      shadcn UI
                    </a>
                  </li>
                  <li className="flex items-center gap-2">
                    <SiVercel className="h-4 w-4" />
                    <a
                      href="https://vercel.com/"
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-primary hover:underline"
                    >
                      Vercel
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <div className="mb-3 flex items-center gap-2">
                  <FaServer className="text-primary h-5 w-5" />
                  <h3 className="text-xl font-medium">Backend</h3>
                </div>
                <ul className="space-y-2 pl-4">
                  <li className="flex items-center gap-2">
                    <SiFastapi className="h-4 w-4" />
                    <a
                      href="https://fastapi.tiangolo.com/"
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-primary hover:underline"
                    >
                      FastAPI
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <div className="mb-3 flex items-center gap-2">
                  <FaBrain className="text-primary h-5 w-5" />
                  <h3 className="text-xl font-medium">Model</h3>
                </div>
                <ul className="space-y-2 pl-4">
                  <li className="flex items-center gap-2">
                    <FaLightbulb className="h-4 w-4" />
                    <a
                      href="https://github.com/ultralytics/ultralytics"
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-primary hover:underline"
                    >
                      YOLO v8s
                    </a>
                  </li>
                  <li className="flex items-center gap-2">
                    <FaDatabase className="h-4 w-4" />
                    <span className="text-sm">
                      Indian Road Traffic Sign Dataset
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Getting Started */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          id="getting-started"
          className="scroll-mt-16"
        >
          <Card className="mb-8 overflow-hidden border p-6 shadow-md md:p-8">
            <div className="mb-4 flex items-center gap-2">
              <FaHome className="text-primary h-5 w-5" />
              <h2 className="text-2xl font-semibold">Getting Started</h2>
            </div>
            <Separator className="mb-6" />

            <h3 className="mb-3 text-xl font-medium">Prerequisites</h3>
            <div className="mb-6 flex flex-wrap gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <FaNodeJs className="h-3 w-3" />
                Node.js v14+
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <FaPython className="h-3 w-3" />
                Python v3.8+
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <FaGithub className="h-3 w-3" />
                Git
              </Badge>
            </div>

            <Tabs defaultValue="frontend" className="mb-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="frontend">Frontend Setup</TabsTrigger>
                <TabsTrigger value="backend">Backend Setup</TabsTrigger>
              </TabsList>
              <TabsContent value="frontend" className="mt-4 space-y-4">
                <div>
                  <h4 className="mb-2 font-medium">1. Clone the repository:</h4>
                  <div className="bg-muted rounded-md p-3 font-mono text-sm">
                    <code>
                      git clone https://github.com/Signalyze/www.git
                      <br />
                      cd www
                    </code>
                  </div>
                </div>
                <div>
                  <h4 className="mb-2 font-medium">
                    2. Install dependencies and run:
                  </h4>
                  <div className="bg-muted rounded-md p-3 font-mono text-sm">
                    <code>
                      npm install
                      <br />
                      npm run dev
                    </code>
                  </div>
                  <p className="mt-2 text-sm">
                    Open{' '}
                    <a
                      href="http://localhost:3000"
                      className="text-primary hover:underline"
                    >
                      localhost:3000
                    </a>{' '}
                    to view it in your browser.
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="backend" className="mt-4 space-y-4">
                <div>
                  <h4 className="mb-2 font-medium">1. Clone the repository:</h4>
                  <div className="bg-muted rounded-md p-3 font-mono text-sm">
                    <code>
                      git clone https://github.com/Signalyze/backend.git
                      <br />
                      cd backend
                    </code>
                  </div>
                </div>
                <div>
                  <h4 className="mb-2 font-medium">
                    2. Create and activate virtual environment:
                  </h4>
                  <div className="bg-muted rounded-md p-3 font-mono text-sm">
                    <code>
                      python -m venv venv
                      <br />
                      source venv/bin/activate # On Windows use
                      `venv\Scripts\activate`
                    </code>
                  </div>
                </div>
                <div>
                  <h4 className="mb-2 font-medium">
                    3. Install and run the server:
                  </h4>
                  <div className="bg-muted rounded-md p-3 font-mono text-sm">
                    <code>
                      pip install -r requirements.txt
                      <br />
                      uvicorn index:app --reload
                    </code>
                  </div>
                  <p className="mt-2 text-sm">
                    The API will be available at{' '}
                    <a
                      href="http://localhost:8000"
                      className="text-primary hover:underline"
                    >
                      localhost:8000
                    </a>
                    .
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </motion.div>

        {/* Contributing & License & Contact */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div className="grid gap-8 md:grid-cols-2">
            <Card
              id="contributing"
              className="scroll-mt-16 overflow-hidden border p-6 shadow-md md:p-8"
            >
              <div className="mb-4 flex items-center gap-2">
                <FaGithub className="text-primary h-5 w-5" />
                <h2 className="text-2xl font-semibold">Contributing</h2>
              </div>
              <Separator className="mb-4" />
              <p className="mb-4">
                We welcome contributions from the community!
              </p>
              <ol className="ml-5 list-decimal space-y-2">
                <li>Fork the repository.</li>
                <li>Create a new branch for your feature or bug fix.</li>
                <li>Commit your changes with clear messages.</li>
                <li>Submit a pull request detailing your changes.</li>
              </ol>
            </Card>

            <div id="contact" className="scroll-mt-16 space-y-8">
              <Card className="overflow-hidden border p-6 shadow-md md:p-8">
                <h2 className="mb-4 text-2xl font-semibold">License</h2>
                <Separator className="mb-4" />
                <p>
                  This project is licensed under the{' '}
                  <a href="#" className="text-primary hover:underline">
                    MIT License
                  </a>
                  .
                </p>
              </Card>

              <Card className="overflow-hidden border p-6 shadow-md md:p-8">
                <h2 className="mb-4 text-2xl font-semibold">Contact</h2>
                <Separator className="mb-4" />
                <p>
                  For any questions, feedback, or support, please create an
                  issue at the respective repository.
                </p>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
