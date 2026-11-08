// CHAPTER - 2
import React from "react";
import {
    Candy,
    Plus,
    Minus,
    X,
    Divide,
    Star,
    Zap,
    CheckCircle2,
    Printer,
    Lightbulb,
    Trophy,
    AlertTriangle,
    RotateCcw,
    Target,
    Hash,
    Info
} from 'lucide-react';

const Chapter2 = () => {
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
        <div className={`relative bg-white rounded-3xl p-6 border-2 border-${colorClass}-200 shadow-md my-6`}>

            {/* Title */}
            <div className="flex items-center gap-2 mb-4">
                <div className={`p-2 rounded-full bg-${colorClass}-500 text-white shadow`}>
                    <Zap size={16} />
                </div>
                <p className={`font-black text-${colorClass}-700 uppercase tracking-wide`}>
                    {title}
                </p>
            </div>

            {/* Steps */}
            <div className="space-y-3">
                {steps.map((step, i) => (
                    <div key={i} className="flex items-start gap-3">

                        {/* Step Number */}
                        <div className={`w-7 h-7 flex items-center justify-center rounded-full bg-${colorClass}-500 text-white text-xs font-bold shadow`}>
                            {i + 1}
                        </div>

                        {/* Step Text */}
                        <p className="text-gray-700 font-semibold leading-snug">
                            {step}
                        </p>

                    </div>
                ))}
            </div>

            {/* Bottom Accent */}
            <div className={`mt-5 h-1 w-20 bg-${colorClass}-400 rounded-full`}></div>
        </div>
    );

    const MistakeBox = ({ mistakes }) => (
        <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-3xl p-6 my-6 shadow-md">

            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
                <div className="bg-red-500 text-white p-2 rounded-full shadow">
                    <AlertTriangle size={16} />
                </div>
                <h4 className="text-red-700 font-black uppercase tracking-wide">
                    Common Mistakes
                </h4>
            </div>

            {/* Mistakes List */}
            <div className="space-y-2">
                {mistakes.map((m, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm">

                        {/* Bullet */}
                        <span className="text-red-500 font-black">✖</span>

                        {/* Text */}
                        <p className="text-red-800 font-semibold leading-snug">
                            {m}
                        </p>

                    </div>
                ))}
            </div>

            {/* Bottom Accent */}
            <div className="mt-4 h-1 w-20 bg-red-400 rounded-full"></div>
        </div>
    );

    const DetailedExample = ({ title, problem, steps, colorClass, result }) => (
        <div className={`bg-white rounded-[2rem] border-2 border-${colorClass}-200 p-6 mb-8 shadow-sm break-inside-avoid`}>

            {/* Title */}
            <h5 className={`font-black text-${colorClass}-700 mb-4 flex items-center gap-2`}>
                <Star size={18} /> Example: {title}
            </h5>

            <div className="grid md:grid-cols-2 gap-6 items-start">

                {/* LEFT SIDE → Steps */}
                <div className="space-y-3">

                    {steps.map((s, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm">

                            {/* Dot */}
                            <div className={`w-2.5 h-2.5 mt-2 rounded-full bg-${colorClass}-500 shrink-0`}></div>

                            {/* Step Text */}
                            <p className="text-slate-600 font-medium leading-snug">
                                {s}
                            </p>

                        </div>
                    ))}

                    {/* Final Answer */}
                    <div className={`mt-4 p-3 bg-${colorClass}-50 rounded-xl border border-${colorClass}-100`}>
                        <p className="font-bold text-sm">
                            Final Answer:{" "}
                            <span className={`text-${colorClass}-700 underline decoration-double font-black`}>
                                {result}
                            </span>
                        </p>
                    </div>

                </div>

                {/* RIGHT SIDE → Working */}
                <div className="bg-slate-50 p-6 rounded-2xl font-mono text-xl text-right border border-slate-200 shadow-inner overflow-x-auto">
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
        .strike { position: relative; display: inline-block; }
        .strike::after {
          content: ""; position: absolute; left: 0; top: 50%; width: 100%; border-top: 2px solid red;
          transform: rotate(-45deg);
        }
      `}</style>

                {/* COVER PAGE */}
                <header className="min-h-screen w-full bg-gradient-to-br from-pink-100 via-orange-50 to-yellow-50 flex items-center">

                    <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center w-full px-6 md:px-10 lg:px-20">

                        {/* LEFT SIDE */}
                        <div className="flex flex-col justify-center h-full">

                            {/* Chapter */}
                            <div className="inline-block bg-white text-pink-600 px-5 py-2 rounded-full text-xs font-bold tracking-widest uppercase shadow mb-6 w-fit">
                                Chapter - 2
                            </div>

                            {/* Title */}
                            <h1 className="text-6xl font-extrabold text-pink-600 leading-tight mb-2">
                                Candy <br /> Factory
                            </h1>

                            {/* Subtitle */}
                            <h2 className="text-2xl font-bold text-orange-500 mb-4">
                                The Four Factors
                            </h2>

                            {/* Divider */}
                            <div className="w-16 h-1 bg-pink-500 rounded mb-6"></div>

                            {/* Topics */}
                            <p className="text-md text-gray-700 font-semibold mb-6 leading-relaxed">
                                Addition • Subtraction • Multiplication • Division
                            </p>

                            {/* Quote */}
                            <div className="bg-white text-pink-600 px-5 py-3 rounded-xl text-sm font-semibold border border-pink-200 shadow-md italic w-fit">
                                "Practice these sums again and again to master them!"
                            </div>

                            {/* Footer */}
                            <p className="mt-8 text-gray-700 font-semibold text-sm">
                                Class 5 Mathematics
                            </p>

                        </div>

                        {/* RIGHT SIDE */}
                        <div className="flex justify-center items-center">

                            <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl hover:scale-105 transition duration-300">
                                <img
                                    src="https://cdn-icons-png.flaticon.com/512/2103/2103633.png"
                                    alt="math illustration"
                                    className="w-72 h-72 object-contain"
                                />
                            </div>

                        </div>

                    </div>

                </header>
                <main className="max-w-5xl mx-auto px-4 space-y-32">

                    {/* CANDY 1: ADDITION */}
                    <section className="bg-blue-50 rounded-[3rem] border-b-8 border-r-8 border-blue-400 p-8 shadow-xl">
                        <TopicHeader number="1" title="Addition Adventure" color={{ bg: 'bg-blue-500', text: 'text-blue-700' }} icon={Plus} />

                        <StepBox colorClass="blue" steps={["Write numbers vertically (Ones under Ones).", "Start adding from the right (Ones column).", "If sum is 10 or more, write the ones below and carry the tens to the TOP row.", "Always add the carry digit first in the next column."]} />
                        <MistakeBox mistakes={["Aligning numbers from the left.", "Forgetting to add the carry digit at the top.", "Writing the whole sum in one column instead of carrying."]} />

                        <div className="space-y-8 mt-10">
                            <DetailedExample colorClass="blue" title="9-Digit with Top Carries" result="1553" steps={["Align 568 and 985.", "8+5=13. Write 3, Carry 1 to top.", "6+8+1=15. Write 5, Carry 1 to top.", "5+9+1=15. Write 15."]}
                                problem={(
                                    <div className="text-right whitespace-pre tracking-widest">
                                        <p className="text-blue-500 font-bold">             ① ①   </p>
                                        <p>    5 6 8</p>
                                        <p className="border-b-4 border-blue-200">+   9 8 5</p>
                                        <p className="font-black text-blue-700 bg-white inline-block px-2 border-2 border-red-500">1 5 5 3</p>
                                    </div>
                                )}
                            />
                            <DetailedExample colorClass="blue" title="Lakhs Alignment" result="977" steps={["Align 479 and 498.", "9+8=17. Write 7, Carry 1.", "7+9+1=17. Write 7, Carry 1.", "4+4+1=9."]}
                                problem={(
                                    <div className="text-right whitespace-pre tracking-widest">
                                        <p className="text-blue-500 font-bold">             ① ①   </p>
                                        <p>    4 7 9</p>
                                        <p className="border-b-4 border-blue-200">+   4 9 8</p>
                                        <p className="font-black text-blue-700 bg-white inline-block px-2 border-2 border-red-500">  9 7 7</p>
                                    </div>
                                )}
                            />
                        </div>

                        <ExerciseSet title="Exercise 1: Standard Sums" questions={Array.from({ length: 25 }, (_, i) => `${(Math.random() * 1000000).toFixed(0)} + ${(Math.random() * 1000000).toFixed(0)}`)} />
                        <ExerciseSet
                            title="Exercise 2: Addition Story Problems"
                            questions={[
                                "A library had 45,600 books and added 12,400 more books. How many books are there in total?",
                                "Store A sold 5,00,000 chocolate bars and Store B sold 4,99,999 bars. What is the total number of bars sold?",
                                "The population of a town was 12,34,567 and it increased by 1,23,433 people. What is the new population?",
                                "A company earned ₹45,67,800 in January and ₹12,32,200 in February. What is the total earning?",
                                "NASA traveled 12 million km and ISRO traveled 15 million km. What is the total distance traveled?",
                                "A factory produced 1,25,000 toys in the morning and 2,75,000 in the evening. What is the total production?",
                                "A bank balance was ₹45,00,000 and ₹55,00,000 was deposited. What is the new balance?",
                                "A rocket used 1,20,000 liters of fuel and then used 80,000 liters more. What is the total fuel used?",
                                "Candidate A received 4,56,789 votes and Candidate B received 5,43,211 votes. What is the total number of votes?",
                                "A school bought 12,000 chairs and 8,000 desks. What is the total number of furniture items?"
                            ]}
                            columns={1}
                        /> </section>

                    {/* CANDY 2: SUBTRACTION */}
                    <section className="bg-red-50 rounded-[3rem] border-b-8 border-r-8 border-red-400 p-8 shadow-xl">
                        <TopicHeader number="2" title="Subtraction Safari" color={{ bg: 'bg-red-500', text: 'text-red-700' }} icon={Minus} />

                        <StepBox colorClass="red" steps={["Top number (Minuend) must be larger.", "Start from right. If top digit < bottom digit, BORROW 1 from the next left.", "Srike out the neighbor, decrease it by 1, and write the new value at the TOP.", "Add 10 to your current digit. Subtract and repeat!"]} />
                        <MistakeBox mistakes={["Forgetting to decrease the neighbor after borrowing.", "Subtracting smaller from bigger in reverse order.", "Confusion with multiple zeros (Borrowing chain)."]} />

                        <div className="space-y-8 mt-10">
                            <DetailedExample colorClass="red" title="Indian Style Borrowing" result="55,709" steps={["Align 84,248 and 28,539.", "Ones: 8-9? Borrow from 4. 4 becomes 3. 8 becomes 18. 18-9=9.", "Tens: 3-3=0.", "Hundreds: 2-5? Borrow from 4. 4 becomes 3. 2 becomes 12. 12-5=7.", "Thousands: 3-8? Borrow from 8. 8 becomes 7. 3 becomes 13. 13-8=5.", "Ten-Thousand: 7-2=5."]}
                                problem={(
                                    <div className="text-right whitespace-pre tracking-widest">
                                        <p className="text-red-500 font-bold"> 7  13  12  3  18 </p>
                                        <p className="text-slate-800"> <span className="strike">8</span>   <span className="strike">4</span>   <span className="strike">2</span>   <span className="strike">4</span>   <span className="strike">8</span></p>
                                        <p className="border-b-4 border-red-200">- 2   8   5   3   9</p>
                                        <p className="font-black text-red-700 italic"> 5   5   7   0   9</p>
                                    </div>
                                )}
                            />
                            <DetailedExample colorClass="red" title="Borrow from Lakhs" result="37,50,000" steps={["50,00,000 - 12,50,000.", "Borrow across zeros. 5 becomes 4. Middle zeros become 9.", "Subtract normally."]}
                                problem={(
                                    <div className="text-right whitespace-pre tracking-widest">
                                        <p className="text-red-500 font-bold text-left">   4 9 10 </p>
                                        <p className="text-slate-800"> <span className="strike">5</span> <span className="strike">0</span> <span className="strike">0</span>,0 0, 0 0 0</p>
                                        <p className="border-b-4 border-red-200">- 1 2 5,0 0, 0 0 0</p>
                                        <p className="font-black text-red-700 italic"> 3 7 5, 0 0, 0 0 0</p>
                                    </div>
                                )}
                            />
                        </div>

                        <ExerciseSet title="Exercise 1: Standard Sums (Borrowing)" questions={Array.from({ length: 25 }, (_, i) => `${(Math.random() * 1000000 + 1000000).toFixed(0)} - ${(Math.random() * 1000000).toFixed(0)}`)} />
                        <ExerciseSet
                            title="Exercise 2: Subtraction Story Problems"
                            questions={[
                                "A store had 10,00,000 candies and sold 7,50,600 candies. How many candies are left?",
                                "The total budget was ₹50,00,000 and ₹34,45,000 was spent. What is the remaining balance?",
                                "Town A had 45,000 people and 12,539 people moved away. What is the new population?",
                                "A journey is 5,600 km long and 3,450 km has been covered. How much distance is left?",
                                "A bank had ₹1,00,00,000 and ₹45,67,890 was withdrawn. What amount is remaining?",
                                "The maximum marks are 500 and a student scored 425. How many marks did the student miss?",
                                "A forest had 12,345 trees and 1,234 trees were cut down. How many trees remain?",
                                "A water tanker had 12,000 liters of water and 4,567 liters were used. How much water is left?",
                                "A company made a profit of 85 lakhs and had expenses of 60.5 lakhs. What is the net profit?",
                                "A student needs 1,200 points to qualify and has scored 845 points. How many more points are needed?"
                            ]}
                            columns={1}
                        /></section>

                    {/* CANDY 3: MULTIPLICATION */}
                    <section className="bg-yellow-50 rounded-[3rem] border-b-8 border-r-8 border-yellow-400 p-8 shadow-xl">
                        <TopicHeader number="3" title="Multiplication Magic" color={{ bg: 'bg-yellow-500', text: 'text-yellow-700' }} icon={X} />

                        <StepBox colorClass="yellow" steps={["Multiply by Ones first. No X needed.", "Move to Tens. Add one 'X' placeholder at the end.", "Move to Hundreds. Add two 'XX' placeholders.", "Move to Thousands. Add three 'XXX' placeholders.", "Add all the partial products together."]} />
                        <MistakeBox
                            mistakes={[
                                "Forgetting placeholders (X).",
                                "Wrong carry during multiplication.",
                                "Skipping addition of rows."
                            ]}
                        />
                        <div className="space-y-8 mt-10">
                            <DetailedExample colorClass="yellow" title="3-Digit Multiplier (X Logic)" result="61724" steps={["Multiply 2374 by 6 (Ones). Result 14244.", "Multiply 2374 by 2 (Tens). Add one 'X'. Result 4748X.", "Add 14244 + 47480 = 61724."]}
                                problem={(
                                    <div className="text-right whitespace-pre tracking-widest">
                                        <p className="text-yellow-600 font-bold"></p>
                                        <p>    2 3 7 4</p>
                                        <p className="border-b-4 border-yellow-300">x     2 6</p>
                                        <p>  1 4 2 4 4</p>
                                        <p>+ 4 7 4 8 <span className="text-red-500 font-bold">X</span></p>
                                        <p className="border-t-4 border-slate-400 font-black text-yellow-700">6 1 7 2 4</p>
                                    </div>
                                )}
                            />
                            <DetailedExample colorClass="yellow" title="Big multiplier (XX placeholders)" result="1,54,325" steps={["12345 x 125.", "Line 1: x 5 (Ones).", "Line 2: x 2 (Tens). Put 'X'.", "Line 3: x 1 (Hundreds). Put 'XX'."]}
                                problem={(
                                    <div className="text-right whitespace-pre text-sm">
                                        <p>     12345</p>
                                        <p className="border-b-2">x      125</p>
                                        <p>     61725</p>
                                        <p>    24690<span className="text-red-500 font-bold">X</span></p>
                                        <p>   12345<span className="text-red-500 font-bold">XX</span></p>
                                        <p className="border-t-2 font-black text-yellow-700 italic">  15,43,125</p>
                                    </div>
                                )}
                            />
                        </div>

                        <ExerciseSet title="Exercise 1: Standard Sums (3-4 Digit Multipliers)" questions={["1234 x 125", "4500 x 250", "8888 x 333", "5678 x 1001", "10101 x 99", "12345 x 111", "5000 x 250", "4321 x 123", "9000 x 450", "1111 x 1111", "25000 x 12", "7500 x 125", "1212 x 212", "4567 x 321", "1000 x 1234", "9876 x 205", "5555 x 444", "123 x 4567", "600 x 1200", "4444 x 222", "5000 x 111", "12345 x 12", "67890 x 10", "45000 x 30", "12000 x 12"]} />
                        <ExerciseSet
                            title="Exercise 2: Multiplication Story Problems"
                            questions={[
                                "Each box contains 144 pens. If there are 12,000 boxes, how many pens are there in total?",
                                "A factory produces 4,500 items every hour. How many items are produced in 24 hours?",
                                "The price of 1 kg of apples is ₹120. What is the cost of 125 kg of apples?",
                                "One truck can carry 4,500 kg of goods. What is the total weight carried by 50 trucks?",
                                "Each notebook has 200 pages. How many pages are there in 5,000 notebooks?",
                                "The monthly rent is ₹12,500. What is the total rent for 2 years (24 months)?",
                                "The cost of one movie ticket is ₹250. If 450 people watch the movie, what is the total collection?",
                                "A student reads 45 pages every day. How many pages will the student read in 365 days?",
                                "One tree produces 125 apples. How many apples are produced by 8,000 trees?",
                                "A person saves ₹2,500 every month. How much will be saved in 120 months?"
                            ]}
                            columns={1}
                        /></section>

                    {/* CANDY 4: DIVISION */}
                    <section className="bg-green-50 rounded-[3rem] border-b-8 border-r-8 border-green-400 p-8 shadow-xl">
                        <TopicHeader number="4" title="Division Discovery" color={{ bg: 'bg-green-500', text: 'text-green-700' }} icon={Divide} />

                        <StepBox colorClass="green" steps={["Check how many times divisor fits in the first group.", "Subtract to find remainder.", "Drop down the next digit.", "ZERO RULE: If you drop a digit and the number is STILL smaller than the divisor", " you MUST put a 0 in the quotient before dropping another!"]} />
                        <MistakeBox
                            mistakes={[
                                "Forgetting to write 0 in quotient.",
                                "Wrong subtraction.",
                                "Skipping steps in long division."
                            ]}
                        />
                        <div className="space-y-8 mt-10">
                            <DetailedExample colorClass="green" title="Zero Quotient Rule (5738 ÷ 19)" result="302" steps={["19 into 57 fits 3 times. Write 3.", "Subtract 57-57 = 0. Drop down 3.", "Can 19 fit into 3? NO. Put 0 in quotient.", "Drop down 8. Now it's 38. 19 x 2 = 38.", "Write 2. Final 302."]}
                                problem={(
                                    <div className="text-right font-mono pr-4">
                                        <p>      3<span className="text-red-500 font-bold italic">0</span>2 </p>
                                        <p className="border-t-2 border-slate-400">19 | 5738 </p>
                                        <p>- 57 </p>
                                        <p className="border-t border-slate-300"> 03 </p>
                                        <p className="text-red-400 italic text-[10px]"> (Drop 3, cant fit 19, keep 0) </p>
                                        <p> 38 </p>
                                        <p>- 38 </p>
                                        <p className="border-t font-black"> 0 </p>
                                    </div>
                                )}
                            />
                        </div>

                        <div className="space-y-8 mt-10">

                            <DetailedExample
                                colorClass="green"
                                title="Division with Remainder (748 ÷ 6)"
                                result="124"
                                steps={[
                                    "6 into 7 fits 1 time. Write 1.",
                                    "Subtract 7 - 6 = 1. Drop down 4 → 14.",
                                    "6 into 14 fits 2 times. Write 2.",
                                    "Subtract 14 - 12 = 2. Drop down 8 → 28.",
                                    "6 into 28 fits 4 times. Write 4.",
                                    "Subtract 28 - 24 = 4. This is remainder."
                                ]}

                                problem={(
                                    <div className="text-right font-mono pr-4">
                                        <p>      124 <span className="text-red-500 font-bold italic"></span></p>
                                        <p className="border-t-2 border-slate-400">6 | 748</p>
                                        <p>- 6</p>
                                        <p className="border-t border-slate-300"> 14</p>
                                        <p>- 12</p>
                                        <p className="border-t border-slate-300"> 28</p>
                                        <p>- 24</p>
                                        <p className="border-t font-black"> 4</p>
                                    </div>
                                )}
                            />

                        </div>

                        <ExerciseSet title="Exercise 1: Standard Sums (2-Digit Divisors)" questions={["56,048 ÷ 12", "4,50,709 ÷ 15", "13,399 ÷ 13", "5,73,800 ÷ 19", "42,089 ÷ 40", "1,25,141 ÷ 25", "4,50,739 ÷ 50", "9,99,999 ÷ 11", "8,10,358 ÷ 90", "123456 ÷ 15", "568903 ÷ 20", "444,222 ÷ 12", "120,116 ÷ 30", "750,007 ÷ 15", "1,44,083 ÷ 17", "1,69,144 ÷ 13", "2,25,908 ÷ 24", "4,13,976 ÷ 18", "10,78,690 ÷ 24", "12,12,120 ÷ 26", "9,20,708 ÷ 27", "15,00,000 ÷ 25", "5,45,45,900 ÷ 50", "1,01,01,010 ÷ 11", "6,35,790 ÷ 15"]} />
                        <ExerciseSet
                            title="Exercise 2: Division Story Problems"
                            questions={[
                                "A factory made 9,000 candies and packed them equally into 30 boxes. How many candies in each box?",
                                "A school has 1,200 students. They are divided equally into 12 classes. How many students per class?",
                                "A shop earned ₹48,000 in 6 days. What is the earning per day?",
                                "A library has 15,000 books arranged on 50 shelves. How many books per shelf?",
                                "A truck carries 8,400 kg of goods in 7 trips. How much per trip?",
                                "A farmer harvested 6,300 fruits and packed them equally into 9 baskets. How many fruits per basket?",
                                "A company distributed ₹5,00,000 equally among 25 employees. How much does each get?",
                                "A train travels 3,600 km in 12 hours. What is the distance covered per hour?",
                                "A school bought 2,400 notebooks for 60 students. How many notebooks per student?",
                                "A tank contains 9,000 liters of water, used equally over 30 days. How much per day?"
                            ]}
                            columns={1}
                        />
                    </section>

                    {/* DECIMALS SECTION */}
                    <section className="bg-pink-50 rounded-[3rem] border-b-8 border-r-8 border-pink-400 p-8 shadow-xl break-inside-avoid">
                        <TopicHeader number="5" title="Decimals Discovery" color={{ bg: 'bg-pink-500', text: 'text-pink-700' }} icon={Info} />

                        <div className="bg-pink-600 text-white p-6 rounded-3xl mb-8">
                            <h4 className="font-bold flex items-center gap-2 mb-4 italic text-lg underline"><Info size={20} /> The Values After Point</h4>
                            <div className="grid md:grid-cols-3 gap-4 text-center">
                                <div className="bg-white/10 p-3 rounded-xl border border-white/20">
                                    <p className="font-black text-xl">Tenths</p>
                                    <p className="text-xs italic">1/10 or 0.1</p>
                                </div>
                                <div className="bg-white/10 p-3 rounded-xl border border-white/20">
                                    <p className="font-black text-xl">Hundredths</p>
                                    <p className="text-xs italic">1/100 or 0.01</p>
                                </div>
                                <div className="bg-white/10 p-3 rounded-xl border border-white/20">
                                    <p className="font-black text-xl">Thousandths</p>
                                    <p className="text-xs italic">1/1000 or 0.001</p>
                                </div>
                            </div>
                        </div>

                        <ExerciseSet title="Decimals Identity & Quiz (20 QS)" questions={[
                            "What is 5/10 as decimal?", "In 12.34, which digit is in Hundredths?", "Write 'Six-Tenths' as a number.", "Convert 0.007 into a Fraction.", "Place of 9 in 0.129.", "Write 1.5 in words.", "Convert 45/100 into decimal.", "In 0.876, name the position of 6.", "Write 0.1 as a fraction.", "Is 0.50 same as 0.5?", "Write 'Twelve Thousandths' as number.", "Convert 0.25 into fraction.", "Place value of 4 in 4.5.", "Place value of 4 in 0.4.", "Compare: 0.1 [ ] 0.01", "Write 9/1000 as decimal.", "Name digit in Tenths place of 15.08.", "Write 0.001 as fraction.", "Decimal for 'Nine and five tenths'.", "Convert 12/10 into decimal."
                        ]} />
                    </section>

                    {/* MARATHON STORY PROBLEMS */}
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
                                <p className="text-orange-400 font-bold uppercase tracking-widest text-xs mt-2">25 Story Challenges for Geniuses</p>
                            </div>
                        </div>

                        <ExerciseSet color="yellow" icon={Star} title="Final 25 Challenges" questions={[
                            "Town A: 45,67,120 ppl. Town B: 12,33,400. Combined?",
                            "10,00,000 candies. 45,678 broken. Good count?",
                            "1 book has 125 pages. Total in 5,000 books?",
                            "₹1,25,000 shared by 25 winners. Each?",
                            "Spent ₹4,500 on 10 bags. Cost per bag?",
                            "Flight ticket ₹4,500. 20 people. Total?",
                            "12 boxes of 50 chocolates each. Total?",
                            "Students: 1,200. Boys: 650. Girls?",
                            "Car travels 480km on 40L. km/L?",
                            "Bank had ₹1,00,00,000. Took ₹45,67,891. Left?",
                            "15 rows, 25 chairs each. Total chairs?",
                            "600 candies shared by 12 friends. Each?",
                            "Price of 1 gram gold ₹6,000. 100 grams?",
                            "A car travels 500km in 5 hours. Speed/hr?",
                            "Walked 1,200m then 800m. Total distance?",
                            "12 pens per pack. 15 packs. Total pens?",
                            "1,200 apples shared by 60 kids. Each?",
                            "Buy bike ₹75,000. Sell ₹62,000. Loss?",
                            "Movie bill ₹1,200 for 4 people. Each pays?",
                            "Price of 1kg apple ₹150. 10kg cost?",
                            "School has 1,200 students. Girls 40%. Count?",
                            "Spent ₹2,500 then ₹1,200 from ₹5,000. Left?",
                            "Library has 50k books. Gave 5k away. Left?",
                            "A forest has 1,200 trees. Each tree 50 fruits. Total?",
                            "Run 5km daily. Total in February (28 days)?"
                        ]} columns={1} />
                    </section>

                </main>

                <footer className="max-w-5xl mx-auto mt-20 text-center pb-12 px-4 no-print">
                    <div className="flex justify-center gap-4 mb-6">
                        <button onClick={printPage} className="bg-pink-600 text-white px-10 py-4 rounded-full font-black flex items-center gap-2 shadow-xl hover:scale-105 transition-all">
                            <Printer size={20} /> PRINT ALL CANDIES (PDF)
                        </button>
                    </div>
                    <div className="grid md:grid-cols-4 gap-4 text-xs font-black uppercase text-slate-400">
                        <p>✔ Add: Carry Top</p>
                        <p>✔ Sub: Slash Borrow</p>
                        <p>✔ Multi: X-Placeholder</p>
                        <p>✔ Div: Zero Rule</p>
                    </div>
                    <p className="mt-8 text-gray-300 font-bold uppercase tracking-widest text-[10px]">
                        Four Factors • Eswar Sai's Mastery Series
                    </p>
                </footer>
            </div>
        );
    };
};

export default Chapter2;

