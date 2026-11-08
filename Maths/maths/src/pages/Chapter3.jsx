
// CHAPTER - 3
import React from 'react';
import {
    Candy,
    Boxes,
    Layers,
    Star,
    Zap,
    CheckCircle2,
    Printer,
    Lightbulb,
    Trophy,
    AlertTriangle,
    RotateCcw,
    GitMerge,
    Split,
    Fingerprint
} from 'lucide-react';

const Chapter3 = () => {
    const TopicHeader = ({ number, title, color, icon: Icon }) => (
        <div className="flex items-center gap-4 mb-6">
            <div className={`w-16 h-16 rounded-2xl ${color.bg} flex items-center justify-center text-white shadow-lg rotate-3 shrink-0`}>
                <Icon size={36} />
            </div>
            <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Candy - {number}</h3>
                <h2 className={`text-3xl font-black ${color.text} leading-none`}>{title}</h2>
            </div>
        </div>
    );

    const StepBox = ({ steps, title = "How to solve:", colorClass = "indigo" }) => (
        <div className={`bg-white/80 rounded-2xl p-5 border-2 border-${colorClass}-100 shadow-sm my-4`}>
            <p className={`font-bold text-${colorClass}-600 mb-3 flex items-center gap-2 uppercase tracking-tighter`}>
                <Zap size={18} /> {title}
            </p>
            <div className="space-y-3">
                {steps.map((step, i) => (
                    <div key={i} className="flex gap-3 text-sm">
                        <span className={`flex items-center justify-center w-6 h-6 rounded-full font-bold text-white bg-${colorClass}-400 shrink-0`}>{i + 1}</span>
                        <p className="text-gray-700 font-semibold">{step}</p>
                    </div>
                ))}
            </div>
        </div>
    );

    const MistakeBox = ({ mistakes }) => (
        <div className="bg-red-50 border-2 border-red-100 rounded-2xl p-5 my-4">
            <h4 className="text-red-600 font-bold flex items-center gap-2 mb-2 italic text-sm">
                <AlertTriangle size={18} /> Avoiding Mistakes:
            </h4>
            <ul className="list-disc list-inside text-sm text-red-800 space-y-1 font-medium">
                {mistakes.map((m, i) => <li key={i}>{m}</li>)}
            </ul>
        </div>
    );

    const DetailedExample = ({ title, problem, steps, colorClass, result }) => (
        <div className={`bg-white rounded-[2rem] border-2 border-${colorClass}-200 p-6 mb-8 shadow-sm break-inside-avoid`}>
            <h5 className={`font-black text-${colorClass}-700 mb-4 flex items-center gap-2`}>
                <Star size={18} /> Example: {title}
            </h5>
            <div className="grid md:grid-cols-2 gap-6 items-start">
                <div className="space-y-2">
                    {steps.map((s, idx) => (
                        <div key={idx} className="flex gap-2 text-xs">
                            <span className={`text-${colorClass}-500 font-black shrink-0`}>Step {idx + 1}:</span>
                            <p className="text-slate-600 font-medium">{s}</p>
                        </div>
                    ))}
                    <div className={`mt-4 p-3 bg-${colorClass}-50 rounded-xl border border-${colorClass}-100`}>
                        <p className="font-bold text-sm">Final Result: <span className={`text-${colorClass}-700 underline decoration-double font-black`}>{result}</span></p>
                    </div>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl font-mono text-lg text-center border border-slate-200 shadow-inner overflow-x-auto">
                    {problem}
                </div>
            </div>
        </div>
    );

    const ExerciseSet = ({ title, questions, columns = 2, icon = CheckCircle2, color = "green" }) => (
        <div className="bg-white rounded-3xl p-6 border-2 border-dashed border-slate-300 my-8 break-inside-avoid shadow-sm">
            <h4 className="font-black text-slate-700 mb-4 flex items-center gap-2 uppercase tracking-tight">
                {React.createElement(icon, { size: 20, className: `text-${color}-500` })} {title}
            </h4>
            <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-x-8 gap-y-3`}>
                {questions.map((q, i) => (
                    <div key={i} className="text-sm flex gap-2">
                        <span className="font-bold text-slate-400">{i + 1}.</span>
                        <p className="text-slate-600 font-bold">{q}</p>
                    </div>
                ))}
            </div>
        </div>
    );

    const TipsTricks = ({ tips, colorClass }) => {
        // Using a map to fix the color bug Eswar Sai noted
        const bgMap = {
            blue: 'bg-blue-600',
            pink: 'bg-pink-600',
            green: 'bg-green-600',
            purple: 'bg-purple-600'
        };

        return (
            <div className={`${bgMap[colorClass] || 'bg-slate-600'} text-white rounded-2xl p-5 my-4 shadow-md`}>
                <h4 className="font-bold flex items-center gap-2 mb-2 italic text-lg text-white">
                    <Lightbulb size={20} /> Tips & Tricks:
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                    {tips.map((t, i) => (
                        <p key={i} className="text-sm font-bold flex items-start gap-2">
                            <span>⭐</span> {t}
                        </p>
                    ))}
                </div>
            </div>
        );
    };

    const App = () => {
        const printPage = () => { window.print(); };

        return (
            <div id="pdf-content" className="min-h-screen bg-[#FDFCF0] font-sans pb-24 text-slate-800">
                <style>{`
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none; }
          .page-break { page-break-after: always; }
          @page { margin: 15mm; }
        }
      `}</style>

                {/* COVER PAGE */}
                <header className="max-w-5xl mx-auto text-center py-20 bg-gradient-to-br from-purple-50 to-blue-50 rounded-b-[4rem] shadow-sm mb-16 px-4">
                    <div className="flex justify-center mb-6">
                        <div className="bg-white p-6 rounded-full shadow-xl">
                            <Candy size={80} className="text-purple-500 animate-pulse" />
                        </div>
                    </div>
                    <h1 className="text-6xl font-black text-purple-600 mb-4 tracking-tighter uppercase text-center">Candy Factory</h1>
                    <h2 className="text-3xl font-bold text-blue-500 mb-4 tracking-wide text-center uppercase">Chapter 3: Factor Friends</h2>
                    <p className="text-lg text-gray-500 font-bold mb-8 uppercase tracking-widest text-center">Factors • Number Squad • HCF • LCM</p>
                    <div className="bg-white text-purple-600 px-8 py-3 rounded-full text-lg font-black border-2 border-purple-100 shadow-sm italic mx-auto table">
                        "Master the building blocks of numbers!"
                    </div>
                </header>

                <main className="max-w-5xl mx-auto px-4 space-y-32">

                    {/* CANDY 1: FACTORS & MULTIPLES */}
                    <section className="bg-blue-50 rounded-[3rem] border-b-8 border-r-8 border-blue-400 p-8 shadow-xl">
                        <TopicHeader number="1" title="Factors & Multiples" color={{ bg: 'bg-blue-500', text: 'text-blue-700' }} icon={Boxes} />

                        <div className="grid md:grid-cols-2 gap-4">
                            <StepBox colorClass="blue" steps={["Start from 1. Divide the number.", "If remainder is 0, it is a Factor.", "Write them in pairs (Ex: 1x12, 2x6).", "Multiples are found by multiplying the number by 1, 2, 3..."]} />
                            <MistakeBox mistakes={["Missing factors in the middle of a list.", "Confusing Factors (small) with Multiples (large).", "Forgetting 1 and the number itself."]} />
                        </div>

                        <div className="space-y-6 mt-10">
                            <DetailedExample colorClass="blue" title="Factors of 24" result="1, 2, 3, 4, 6, 8, 12, 24" steps={["Start with 1: 1 x 24.", "Check 2: 2 x 12.", "Check 3: 3 x 8.", "Check 4: 4 x 6.", "List all numbers from the pairs."]} problem="Pairs: 1x24, 2x12, 3x8, 4x6" />
                            <DetailedExample colorClass="blue" title="Factors of 18" result="1, 2, 3, 6, 9, 18" steps={["1 x 18.", "2 x 9.", "3 x 6.", "List in order."]} problem="Pairs: 1x18, 2x9, 3x6" />
                            <DetailedExample colorClass="blue" title="Multiples of 15" result="15, 30, 45, 60, 75" steps={["15 x 1 = 15.", "15 x 2 = 30.", "15 x 3 = 45.", "Keep going!"]} problem="15, 30, 45, 60, 75..." />
                            <DetailedExample colorClass="blue" title="Multiples of 20" result="20, 40, 60, 80, 100" steps={["20 x 1, 20 x 2...", "Multiples never end!", "List the first 5."]} problem="20, 40, 60, 80, 100..." />
                        </div>

                        <ExerciseSet title="Exercise 1: Standard Sums" questions={["Factors of 16", "Factors of 45", "Factors of 50", "Factors of 64", "Factors of 81", "Multiples of 7 (First 5)", "Multiples of 13 (First 5)", "Is 5 a factor of 125?", "Common factors of 12 & 18", "Multiples of 9 between 20-50", "Factors of 100", "Factors of 21", "Factors of 36", "Multiples of 25 (First 4)", "Is 8 a factor of 72?", "Common multiples of 4 & 6", "Factors of 12", "Factors of 28", "Multiples of 11 (First 5)", "Factors of 75", "Factors of 90", "Is 10 a multiple of 5?", "Smallest factor of 500", "Largest factor of 42", "How many factors has 17?"]} />
                        <ExerciseSet title="Exercise 2: Story Problems" questions={["A box has 24 chocolates. How many equal ways to group?", "A bus comes every 10 mins. List times in 1 hour.", "Flower shop has 36 roses. Can we make 5 equal bunches?", "Pencils come in packs of 12. Buy 8 packs, total?", "Find a number between 10-20 that is a multiple of 3 & 6.", "Teacher has 48 books for 6 students. Equal sharing?", "Stickers come in multiples of 5. Can I buy 23 stickers?", "Identify common factors of my age (10) and 20.", "Bell rings every 15 mins. How many times in 2 hours?", "Which has more factors: 12 or 15?"]} columns={1} />

                        <TipsTricks colorClass="blue" tips={["Every number has 1 as its smallest factor.", "Multiples are infinite like the sky!", "Even numbers always have 2 as a factor.", "1 is the only number with exactly one factor."]} />
                    </section>

                    {/* CANDY 2: THE NUMBER SQUAD */}
                    <section className="bg-pink-50 rounded-[3rem] border-b-8 border-r-8 border-pink-400 p-8 shadow-xl">
                        <TopicHeader number="2" title="The Number Squad" color={{ bg: 'bg-pink-500', text: 'text-pink-700' }} icon={Fingerprint} />

                        <div className="grid md:grid-cols-2 gap-4">
                            <StepBox colorClass="pink" title="Identity Rules:" steps={[
                                "Even: Ends in 0, 2, 4, 6, 8. Divisible by 2.",
                                "Odd: Ends in 1, 3, 5, 7, 9. Not divisible by 2.",
                                "Prime: Has ONLY 2 factors (1 and itself).",
                                "Composite: Has MORE than 2 factors.",
                                "Twin Primes: Two primes with a gap of 2 (Ex: 3, 5).",
                                "Co-Primes: Numbers sharing ONLY 1 as common factor."
                            ]} />
                            <MistakeBox mistakes={["Thinking 1 is Prime. (1 is neither Prime nor Composite!)", "Thinking all Odd numbers are Prime. (Look at 9 or 15!)", "Thinking Co-primes must be prime numbers."]} />
                        </div>

                        <div className="space-y-6 mt-10">
                            <DetailedExample colorClass="pink" title="Is 13 Prime or Composite?" result="Prime" steps={["List factors of 13.", "Pairs: 1 x 13.", "Only 2 factors found.", "Conclusion: It is Prime!"]} problem="Factors: 1, 13" />
                            <DetailedExample colorClass="pink" title="Are 8 and 15 Co-prime?" result="Yes" steps={["Factors of 8: 1, 2, 4, 8.", "Factors of 15: 1, 3, 5, 15.", "Common factor: Only 1.", "Result: Co-prime!"]} problem="8: {1, 2, 4, 8} | 15: {1, 3, 5, 15}" />
                            <DetailedExample colorClass="pink" title="Is 21 Composite?" result="Yes" steps={["Factors: 1, 3, 7, 21.", "Total: 4 factors.", "Since > 2, it is Composite."]} problem="Factors: 1, 3, 7, 21" />
                            <DetailedExample colorClass="pink" title="Twin Prime Check (11, 13)" result="Yes" steps={["Check if 11 is Prime (Yes).", "Check if 13 is Prime (Yes).", "Gap: 13 - 11 = 2.", "Result: Twin Primes!"]} problem="11 & 13 (Gap is 2)" />
                        </div>

                        <ExerciseSet title="Exercise 1: Identity Quiz" questions={["Is 2 Prime or Composite?", "List first 5 Prime numbers", "List Odd numbers between 20-30", "Is 51 Prime? (Check 3x17!)", "Are 14 and 15 Co-prime?", "Smallest Composite number", "Only Even Prime number", "List 3 pairs of Twin Primes", "Is 0 Even or Odd?", "Composite numbers below 10", "Next Prime after 19", "Is 27 Composite?", "Prime numbers between 1-10", "Are 4 and 9 Co-prime?", "Largest 2-digit Prime number", "Is 91 Composite? (Check 7x13!)", "Sum of first 3 Odd numbers", "Twin Primes between 10-20", "Next Even after 98", "Is 1 a Prime number?", "Smallest Odd Composite number", "Are 21 and 25 Co-prime?", "Factors of 2 Prime numbers", "Next Composite after 15", "Are 12 and 13 Co-prime?"]} />
                        <ExerciseSet title="Exercise 2: Identity Stories" questions={["I am a Prime between 10-20. Digits add to 2. Who?", "Class of 23 kids. Can we group into 4 equal teams?", "Smallest Odd Composite number. Who am I?", "List all Twin Primes below 30.", "Is my house number 45 Prime or Composite?", "Add Odd + Odd. Result is?", "Find two Composite numbers that are Co-prime.", "Why is 2 the 'Hero' of Prime numbers?", "Basket of 15 apples. Can 4 friends share exactly?", "Name a number that is neither Prime nor Composite."]} columns={1} />

                        <TipsTricks colorClass="pink" tips={["2 is the only Even Prime number.", "All Twin Primes except (3, 5) have an even number between them.", "Any two consecutive numbers are always Co-prime.", "Composite numbers have factors other than 1 and self."]} />
                    </section>

                    {/* CANDY 3: HCF (LADDER METHOD) */}
                    <section className="bg-green-50 rounded-[3rem] border-b-8 border-r-8 border-green-400 p-8 shadow-xl">
                        <TopicHeader number="3" title="HCF - The Great Divider" color={{ bg: 'bg-green-500', text: 'text-green-700' }} icon={Split} />

                        <div className="grid md:grid-cols-2 gap-4">
                            <StepBox colorClass="green" title="Ladder Method (L-Division):" steps={["Write numbers side by side.", "Divide both by a COMMON prime (2, 3, 5...).", "Stop when no more common divisors exist.", "Multiply ONLY the divisors on the LEFT side."]} />
                            <MistakeBox mistakes={["Multiplying the bottom remainder numbers (That's for LCM!).", "Stopping too early when a common factor still exists.", "Not using Primes to divide."]} />
                        </div>

                        <div className="space-y-8 mt-10">
                            <DetailedExample colorClass="green" title="HCF of 24 and 36" result="12" steps={["Commonly divide by 2: (12, 18).", "Commonly divide by 2 again: (6, 9).", "Commonly divide by 3: (2, 3).", "Multiply Left Side: 2 x 2 x 3 = 12."]}
                                problem={(<div className="font-mono text-left">2 | 24, 36<br />2 | 12, 18<br />3 |  6,  9<br />  |  2,  3</div>)}
                            />
                            <DetailedExample colorClass="green" title="HCF of 15 and 25" result="5" steps={["No common factor 2 or 3. Use 5.", "Divide by 5: (3, 5).", "Stop. HCF = 5."]}
                                problem={(<div className="font-mono text-left">5 | 15, 25<br />  |  3,  5</div>)}
                            />
                            <DetailedExample colorClass="green" title="HCF of 12 and 16" result="4" steps={["Divide by 2: (6, 8).", "Divide by 2: (3, 4).", "Stop. HCF = 2 x 2 = 4."]}
                                problem={(<div className="font-mono text-left">2 | 12, 16<br />2 |  6,  8<br />  |  3,  4</div>)}
                            />
                            <DetailedExample colorClass="green" title="HCF of 10 and 20" result="10" steps={["Divide by 2: (5, 10).", "Divide by 5: (1, 2).", "HCF = 2 x 5 = 10."]}
                                problem={(<div className="font-mono text-left">2 | 10, 20<br />5 |  5, 10<br />  |  1,  2</div>)}
                            />
                        </div>

                        <ExerciseSet title="Exercise 1: HCF Hunt" questions={["HCF of 12, 18", "HCF of 20, 30", "HCF of 15, 45", "HCF of 40, 60", "HCF of 14, 21", "HCF of 8, 20", "HCF of 36, 54", "HCF of 10, 25", "HCF of 16, 24", "HCF of 22, 33", "HCF of 50, 75", "HCF of 13, 26", "HCF of 9, 27", "HCF of 4, 8, 12", "HCF of 10, 20, 30", "HCF of 18, 24", "HCF of 7, 14", "HCF of 25, 100", "HCF of 35, 49", "HCF of 11, 22", "HCF of 48, 72", "HCF of 6, 12, 18", "HCF of 21, 28", "HCF of 100, 200", "HCF of 15, 20"]} />
                        <ExerciseSet title="Exercise 2: Story Problems" questions={["Two ropes 12m and 18m. Max equal pieces?", "30 boys, 45 girls in teams. Max team size?", "Fill 20L and 30L cans with same cup. Max size?", "Tiles for 12ft by 16ft floor. Max square tile?", "60 apples, 80 oranges. Max fruits per bag?", "divide ₹100 and ₹150 equally. Max amount?", "String A: 24cm, B: 36cm. Max equal cuts?", "Box A: 15kg, B: 25kg. Max common weight?", "Groups of 12 and 18. Max kids per row?", "Smallest divisor for 13 and 17."]} columns={1} />

                        <TipsTricks colorClass="green" tips={["HCF of Co-primes is always 1.", "HCF is also called GCD (Greatest Common Divisor).", "HCF is always <= the smallest number.", "HCF divides all given numbers perfectly."]} />
                    </section>

                    {/* CANDY 4: LCM (COMMON DIVISION METHOD) */}
                    <section className="bg-purple-50 rounded-[3rem] border-b-8 border-r-8 border-purple-400 p-8 shadow-xl">
                        <TopicHeader number="4" title="LCM - The Meeting Point" color={{ bg: 'bg-purple-500', text: 'text-purple-700' }} icon={GitMerge} />

                        <div className="grid md:grid-cols-2 gap-4">
                            <StepBox colorClass="purple" title="Common Division Logic:" steps={["Divide by a prime that fits AT LEAST ONE number.", "Bring down any number that isn't divisible.", "Continue until all numbers become 1.", "Multiply ALL numbers on the LEFT side."]} />
                            <MistakeBox mistakes={["Stopping too early (Wait until all are 1!).", "Forgetting to multiply all the factors.", "Bringing down a number and dividing it by mistake."]} />
                        </div>

                        <div className="space-y-8 mt-10">
                            <DetailedExample colorClass="purple" title="LCM of 12 and 15" result="60" steps={["Divide by 2: (6, 15). 15 brought down.", "Divide by 2: (3, 15).", "Divide by 3: (1, 5).", "Divide by 5: (1, 1).", "LCM = 2x2x3x5 = 60."]}
                                problem={(<div className="font-mono text-left">2 | 12, 15<br />2 |  6, 15<br />3 |  3, 15<br />5 |  1,  5<br />  |  1,  1</div>)}
                            />
                            <DetailedExample colorClass="purple" title="LCM of 4 and 6" result="12" steps={["Divide by 2: (2, 3).", "Divide by 2: (1, 3).", "Divide by 3: (1, 1).", "LCM = 2x2x3 = 12."]}
                                problem={(<div className="font-mono text-left">2 | 4, 6<br />2 | 2, 3<br />3 | 1, 3<br />  | 1, 1</div>)}
                            />
                            <DetailedExample colorClass="purple" title="LCM of 10 and 15" result="30" steps={["Divide by 2: (5, 15).", "Divide by 3: (5, 5).", "Divide by 5: (1, 1).", "LCM = 2x3x5 = 30."]}
                                problem={(<div className="font-mono text-left">2 | 10, 15<br />3 |  5, 15<br />5 |  5,  5<br />  |  1,  1</div>)}
                            />
                            <DetailedExample colorClass="purple" title="LCM of 8 and 12" result="24" steps={["Divide by 2: (4, 6).", "Divide by 2: (2, 3).", "Divide by 2: (1, 3).", "Divide by 3: (1, 1).", "LCM = 24."]}
                                problem={(<div className="font-mono text-left">2 | 8, 12<br />2 | 4,  6<br />2 | 2,  3<br />3 | 1,  3<br />  | 1,  1</div>)}
                            />
                        </div>

                        <ExerciseSet title="Exercise 1: LCM Race" questions={["LCM of 4, 6", "LCM of 8, 12", "LCM of 10, 15", "LCM of 12, 18", "LCM of 5, 7", "LCM of 20, 25", "LCM of 6, 9", "LCM of 14, 21", "LCM of 16, 24", "LCM of 3, 4, 5", "LCM of 11, 13", "LCM of 2, 8, 10", "LCM of 15, 20", "LCM of 30, 40", "LCM of 9, 12", "LCM of 7, 14", "LCM of 10, 20, 30", "LCM of 25, 50", "LCM of 12, 16", "LCM of 5, 10, 15", "LCM of 18, 27", "LCM of 8, 10", "LCM of 40, 60", "LCM of 2, 3, 4", "LCM of 100, 150"]} />
                        <ExerciseSet title="Exercise 2: Story Problems" questions={["Two bells ring every 4 and 6 mins. When together?", "Bus A: 10 mins, Bus B: 15 mins. Next meet?", "Light A flashes every 8s, B every 12s. Common flash?", "Steps: 40cm and 50cm. When do they align?", "Smallest number divisible by 12 and 15.", "Hotdogs (8) and Buns (10). Min to match?", "Frog jumps 3, Toad jumps 5. Common landing?", "Meeting at start: 3 and 4 mins per lap.", "Smallest number with 0 remainder for 6 and 9.", "Signals turn green every 20s and 30s. Next time?"]} columns={1} />

                        <TipsTricks colorClass="purple" tips={["LCM is used for things that happen 'again and again'.", "HCF x LCM = Product of two numbers.", "LCM of Co-primes is just their Multiplication.", "LCM is always >= the largest number."]} />
                    </section>

                    {/* MARATHON CHALLENGE */}
                    <section className="bg-slate-900 text-white rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
                            <Trophy size={140} className="text-yellow-400 rotate-12" />
                        </div>
                        <div className="flex items-center gap-4 mb-10">
                            <div className="bg-orange-500 text-white p-3 rounded-2xl">
                                <RotateCcw size={32} />
                            </div>
                            <div>
                                <h2 className="text-4xl font-black italic tracking-tighter uppercase">Mixed Marathon!</h2>
                                <p className="text-orange-400 font-bold uppercase tracking-widest text-xs mt-2">25 Final Master Challenges</p>
                            </div>
                        </div>
                        <ExerciseSet color="yellow" icon={Star} title="Master Level Challenges" questions={[
                            "HCF of 24 and 32.", "LCM of 6 and 8.", "Is 105 Prime or Composite?", "Smallest 3-digit multiple of 12.", "Are 18 and 35 Co-prime?", "List factors of 36 that are Even.", "HCF of 100 and 101.", "LCM of 10, 100, 1000.", "Smallest number divisible by 2, 3, 5.", "Product of numbers is 48. HCF is 2. LCM?", "Is 231 divisible by 3?", "Sum of all factors of 6.", "Twin Primes between 1 and 20.", "Is every multiple of 4 also a multiple of 2?", "HCF of two Co-primes is what?", "LCM of 11 and 13.", "Factors of 64.", "Multiples of 15 between 50-100.", "Greatest factor of 80.", "Smallest multiple of 99.", "Are 8 and 21 Co-prime?", "HCF of 15, 30, 45.", "Sum of first 5 Prime numbers.", "Is 99 Prime or Composite?", "LCM of 12 and 16."
                        ]} columns={1} />
                    </section>

                    {/* THINK AND TRY */}
                    <section className="bg-white rounded-[3rem] p-10 border-4 border-purple-200 shadow-xl">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="bg-purple-600 text-white p-3 rounded-2xl">
                                <Lightbulb size={32} />
                            </div>
                            <h2 className="text-3xl font-black text-purple-700 uppercase">Think & Try</h2>
                        </div>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="p-6 bg-green-50 rounded-3xl border-2 border-green-100"><span className="text-xs font-black text-green-600 uppercase">Easy</span><p className="mt-2 text-sm font-bold">List 3 numbers with only 2 factors. Name them.</p></div>
                            <div className="p-6 bg-blue-50 rounded-3xl border-2 border-blue-100"><span className="text-xs font-black text-blue-600 uppercase">Medium</span><p className="mt-2 text-sm font-bold">HCF is 1, LCM is 35. What are the numbers?</p></div>
                            <div className="p-6 bg-red-50 rounded-3xl border-2 border-red-100"><span className="text-xs font-black text-red-600 uppercase">Hard</span><p className="mt-2 text-sm font-bold">2-digit multiple of 6. Digit sum is 9. Factors are 9 & 18. Who?</p></div>
                        </div>
                    </section>

                </main>

                <footer className="max-w-5xl mx-auto mt-20 text-center pb-12 px-4 no-print">
                    <div className="flex justify-center gap-4 mb-6">
                        <button onClick={printPage} className="bg-purple-600 text-white px-10 py-4 rounded-full font-black flex items-center gap-2 shadow-xl hover:scale-105 transition-all">
                            <Printer size={20} /> PRINT CHAPTER 3 (PDF)
                        </button>
                    </div>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                        Chapter 3 • Factor Friends • Eswar Sai's Mastery Series
                    </p>
                </footer>
            </div>
        );
    };
};


export default Chapter3;