import {
    Candy,
    Globe,
    ShieldCheck,
    ArrowRightLeft,
    Expand,
    Star,
    BookOpen,
    CheckCircle2,
    ChevronRight,
    Flame,
    Lightbulb,
    Trophy,
    Target,
    Zap,
    HelpCircle,
    Hash,
    Printer,
    Download
} from 'lucide-react';
import html2pdf from "html2pdf.js";

const Chapter1 = () => {
    const TopicHeader = ({ number, title, color }) => (
        <div className="flex items-center gap-4 mb-6">
            <div className={`w-16 h-16 rounded-2xl ${color.bg} flex items-center justify-center text-white shadow-lg rotate-3 shrink-0`}>
                <Candy size={36} />
            </div>
            <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Candy - {number}</h3>
                <h2 className={`text-3xl font-black ${color.text} leading-none`}>{title}</h2>
            </div>
        </div>
    );

    const StepBox = ({ steps, title = "How to solve:" }) => (
        <div className="bg-white/80 rounded-2xl p-5 border-2 border-indigo-100 shadow-sm my-4">
            <p className="font-bold text-indigo-600 mb-3 flex items-center gap-2">
                <Zap size={18} /> {title}
            </p>
            <div className="space-y-2">
                {steps.map((step, i) => (
                    <div key={i} className="flex gap-3 text-sm">
                        <span className="font-bold text-indigo-400">{i + 1}.</span>
                        <p className="text-gray-700">{step}</p>
                    </div>
                ))}
            </div>
        </div>
    );

    const Exercise = ({ title, questions }) => (
        <div className="bg-white rounded-3xl p-6 border-2 border-dashed border-slate-300 my-6 break-inside-avoid">
            <h4 className="font-black text-slate-700 mb-4 flex items-center gap-2 uppercase tracking-tight">
                <CheckCircle2 size={20} className="text-green-500" /> {title}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                {questions.map((q, i) => (
                    <div key={i} className="text-sm flex gap-2">
                        <span className="font-bold text-slate-400">{i + 1}.</span>
                        <p className="text-slate-600">{q}</p>
                    </div>
                ))}
            </div>
        </div>
    );

    const App = () => {
        const printPage = () => {
            window.print();
        };

        const downloadPDF = () => {
            const element = document.getElementById("pdf-content");
            window.html2pdf().from(element).save("math_notes.pdf");
        };


        return (
            <div id="pdf-content" className="min-h-screen bg-[#FDFCF0] ...">
                {/* CHAPTER TITLE */}
                <header className="max-w-5xl mx-auto text-center mb-16 relative">
                    <div className="h-screen flex flex-col items-center justify-center text-center bg-gradient-to-br from-pink-100 to-orange-100 page-break">

                        <h1 className="text-6xl font-black text-pink-600 mb-4">
                            Candy Factory
                        </h1>

                        <h2 className="text-3xl font-bold text-orange-500 mb-2">
                            The Number Systems
                        </h2>

                        <p className="text-lg text-gray-600 font-semibold mb-6">
                            Class 5 Mathematics
                        </p>

                        <img
                            src="https://cdn-icons-png.flaticon.com/512/1046/1046784.png"
                            alt="math icon"
                            className="w-40 opacity-80"
                        />
                        <div className="inline-block bg-pink-100 text-pink-600 px-6 py-1 rounded-full text-sm font-black mb-4 tracking-widest uppercase">
                            Chapter - 1
                        </div>

                    </div>
                </header>

                <main className="max-w-5xl mx-auto space-y-20">

                    {/* CANDY 1: Number Systems */}
                    <section className="bg-blue-50 rounded-[3rem] border-b-8 border-r-8 border-blue-400 p-8 shadow-xl">
                        <TopicHeader number="1" title="The Number Systems" color={{ bg: 'bg-blue-500', text: 'text-blue-700' }} />

                        <div className="grid md:grid-cols-2 gap-8 mb-8">
                            {/* Indian Table */}
                            <div className="bg-white rounded-2xl p-5 shadow-sm border-2 border-blue-100 overflow-hidden">
                                <h4 className="font-black text-blue-600 mb-3 flex items-center gap-2"><Target size={20} /> Indian System Chart</h4>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-[10px] text-center border-collapse">
                                        <thead>
                                            <tr className="bg-blue-500 text-white">
                                                <th className="border p-1" colSpan="2">Crores</th>
                                                <th className="border p-1" colSpan="2">Lakhs</th>
                                                <th className="border p-1" colSpan="2">Thousands</th>
                                                <th className="border p-1" colSpan="3">Ones</th>
                                            </tr>
                                            <tr className="bg-blue-100 text-blue-800 font-bold">
                                                <td className="border p-1">TC</td>
                                                <td className="border p-1">C</td>
                                                <td className="border p-1">TL</td>
                                                <td className="border p-1">L</td>
                                                <td className="border p-1">T-Th</td>
                                                <td className="border p-1">Th</td>
                                                <td className="border p-1">H</td>
                                                <td className="border p-1">T</td>
                                                <td className="border p-1">O</td>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="font-mono text-lg">
                                                <td className="border p-1">1</td><td className="border p-1">2</td>
                                                <td className="border p-1">3</td><td className="border p-1">4</td>
                                                <td className="border p-1">5</td><td className="border p-1">6</td>
                                                <td className="border p-1">7</td><td className="border p-1">8</td><td className="border p-1">9</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <p className="text-[10px] mt-2 text-blue-400 font-bold uppercase">Comma Rule: 3, 2, 2, 2 (Start with 3 from right)</p>
                            </div>

                            {/* International Table */}
                            <div className="bg-white rounded-2xl p-5 shadow-sm border-2 border-green-100 overflow-hidden">
                                <h4 className="font-black text-green-600 mb-3 flex items-center gap-2"><Globe size={20} /> International System Chart</h4>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-[10px] text-center border-collapse">
                                        <thead>
                                            <tr className="bg-green-500 text-white">
                                                <th className="border p-1" colSpan="3">Millions</th>
                                                <th className="border p-1" colSpan="3">Thousands</th>
                                                <th className="border p-1" colSpan="3">Ones</th>
                                            </tr>
                                            <tr className="bg-green-100 text-green-800 font-bold">
                                                <td className="border p-1">HM</td><td className="border p-1">TM</td><td className="border p-1">M</td>
                                                <td className="border p-1">H-Th</td><td className="border p-1">T-Th</td><td className="border p-1">Th</td>
                                                <td className="border p-1">H</td><td className="border p-1">T</td><td className="border p-1">O</td>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="font-mono text-lg">
                                                <td className="border p-1">1</td><td className="border p-1">2</td><td className="border p-1">3</td>
                                                <td className="border p-1">4</td><td className="border p-1">5</td><td className="border p-1">6</td>
                                                <td className="border p-1">7</td><td className="border p-1">8</td><td className="border p-1">9</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <p className="text-[10px] mt-2 text-green-400 font-bold uppercase">Comma Rule: Always 3, 3, 3 (Group in 3s from right)</p>
                            </div>
                        </div>

                        <StepBox steps={[
                            "Place the number in the chart above starting from 'Ones' place.",
                            "Group the digits using commas according to the system rules.",
                            "Read the group names (Periods) like Millions, Thousands, etc.",
                            "Example: 123,456,789 is 'One hundred twenty-three million...'"
                        ]} />

                        <Exercise title="Exercise 1: Number Naming Factory" questions={[
                            "Write Indian Name for: 75,42,10,500",
                            "Write International Name for: 999,999,999",
                            "Identify the Place of '5' in 45,12,00,000 (Indian)",
                            "Identify the Place of '2' in 123,456,789 (Int)",
                            "Write the number: Five Crore, Two Lakh, Fifty",
                            "Write the number: Twelve Million, Four Hundred",
                            "78,00,00,005 in Indian System",
                            "567,123,000 in International System",
                            "Name the Period for '8' in 8,45,00,000",
                            "Write in words: 101,101,101"
                        ]} />
                    </section>

                    {/* CANDY 2: Roman Numbers */}
                    <section className="bg-red-50 rounded-[3rem] border-b-8 border-r-8 border-red-400 p-8 shadow-xl">
                        <TopicHeader number="2" title="Roman Numerals" color={{ bg: 'bg-red-500', text: 'text-red-700' }} />

                        <div className="grid md:grid-cols-2 gap-8 mb-8">
                            <div className="bg-white p-6 rounded-2xl border-2 border-red-100">
                                <h4 className="font-bold text-red-600 mb-4 flex items-center gap-2 underline uppercase"><Hash size={18} /> Roman symbols</h4>
                                <div className="grid grid-cols-4 gap-2 text-center">
                                    {[['I', '1'], ['V', '5'], ['X', '10'], ['L', '50'], ['C', '100'], ['D', '500'], ['M', '1000']].map(([s, v]) => (
                                        <div key={s} className="bg-red-50 p-2 rounded-lg border border-red-200">
                                            <span className="text-xl font-black block">{s}</span>
                                            <span className="text-m font-bold text-red-600">{v}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl border-2 border-red-100">
                                <h4 className="font-bold text-red-600 mb-4 flex items-center gap-2 underline uppercase"><ShieldCheck size={18} /> The Rules</h4>
                                <ul className="text-sm space-y-2 font-medium">
                                    <li><span className="text-red-500 font-bold">Rule 1 (Add):</span> If smaller is after bigger, add. <span className="italic">Ex: VI = 5 + 1 = 6.</span></li>
                                    <li><span className="text-red-500 font-bold">Rule 2 (Sub):</span> If smaller is before bigger, sub. <span className="italic">Ex: IV = 5 - 1 = 4.</span></li>
                                    <li><span className="text-red-500 font-bold">Rule 3 (Max):</span> Never repeat I, X, C more than 3 times!</li>
                                </ul>
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl p-6 border-2 border-red-200 mb-8 overflow-hidden">
                            <h4 className="font-black text-center text-red-600 mb-4">Roman Table (1 - 50)</h4>
                            <div className="grid grid-cols-5 md:grid-cols-10 gap-3">
                                {[...Array(50)].map((_, i) => {
                                    const n = i + 1;

                                    const roman = (num) => {
                                        const map = {
                                            M: 1000, CM: 900, D: 500, CD: 400,
                                            C: 100, XC: 90, L: 50, XL: 40,
                                            X: 10, IX: 9, V: 5, IV: 4, I: 1
                                        };
                                        let str = '';
                                        for (let key in map) {
                                            while (num >= map[key]) {
                                                str += key;
                                                num -= map[key];
                                            }
                                        }
                                        return str;
                                    };

                                    return (
                                        <div
                                            key={n}
                                            className="bg-white rounded-xl border border-gray-300 shadow-sm p-2 text-center hover:shadow-md hover:scale-105 transition"
                                        >
                                            <p className="text-s text-center font-bold text-gray-900">{n}</p>
                                            <p className="text-xs text-center font-bold text-red-600">{roman(n)}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <StepBox title="How to convert: 94" steps={[
                            "Break the number: 90 + 4",
                            "Convert 90: It is 10 less than 100 (100-10), so write XC.",
                            "Convert 4: It is 1 less than 5 (5-1), so write IV.",
                            "Combine: XCIV"
                        ]} />

                        <Exercise title="Exercise 2: Roman Arena" questions={[
                            "Write 42 in Roman", "Write 99 in Roman", "Write 55 in Roman", "Write 14 in Roman", "Write 88 in Roman",
                            "Write 73 in Roman", "Write 29 in Roman", "Write 48 in Roman", "Write 64 in Roman", "Write 100 in Roman",
                            "What is XXXVI?", "What is XLIX?", "What is LVIII?", "What is XCII?", "What is XIV?",
                            "Compare: XIX [ ] XXI", "Compare: LX [ ] XL", "Compare: XCI [ ] IC (Wait, is IC valid?)", "Roman for 25", "Number for LXXX"
                        ]} />
                    </section>

                    {/* CANDY 3: Expanded Forms */}
                    <section className="bg-yellow-50 rounded-[3rem] border-b-8 border-r-8 border-yellow-400 p-8 shadow-xl">
                        <TopicHeader number="3" title="Stretching Machine" color={{ bg: 'bg-yellow-500', text: 'text-yellow-700' }} />

                        <div className="bg-yellow-100/50 p-6 rounded-3xl border-2 border-yellow-200 mb-8">
                            <h4 className="font-bold text-yellow-800 mb-2 underline">3 Stretching Examples</h4>
                            <div className="space-y-4">
                                <div className="bg-white p-3 rounded-xl border border-yellow-100">
                                    <p className="font-bold">4,50,678</p>
                                    <p className="text-sm font-mono">4,00,000 + 50,000 + 0 + 600 + 70 + 8</p>
                                </div>
                                <div className="bg-white p-3 rounded-xl border border-yellow-100">
                                    <p className="font-bold text-xs">Vice Versa: 5,00,00,000 + 4,000 + 2</p>
                                    <p className="text-sm font-mono">5,00,04,002 (Watch out for missing zeros!)</p>
                                </div>
                            </div>
                        </div>

                        <StepBox title="Steps to Expand:" steps={[
                            "Take the first digit from left.",
                            "Count how many digits are behind it. Put that many zeros.",
                            "Repeat for all digits, adding a '+' between them.",
                            "Skip digits that are '0' or write them as single '0'."
                        ]} />

                        <Exercise title="Exercise 3: Elastic Numbers" questions={[
                            "Expand 12,34,567", "Expand 90,09,00,009", "Expand 55,555", "Expand 1,00,00,001", "Expand 48,20,305",
                            "Short form: 4,00,000 + 2,000 + 5", "Short form: 9L + 8T-Th + 1", "Short form: 7C + 5", "Short form: 10,000 + 1", "Short form: 300 + 20 + 1"
                        ]} />
                    </section>

                    {/* CANDY 4: Place Value & Conversion */}
                    <section className="bg-pink-50 rounded-[3rem] border-b-8 border-r-8 border-pink-400 p-8 shadow-xl">
                        <TopicHeader number="4" title="Identity Lab" color={{ bg: 'bg-pink-500', text: 'text-pink-700' }} />

                        <div className="bg-white p-6 rounded-3xl border-2 border-pink-100 mb-8">
                            <h4 className="font-black text-pink-600 mb-4 flex items-center gap-2"><Flame size={20} /> The Zero Case</h4>
                            <div className="bg-pink-600 text-white p-4 rounded-xl shadow-lg italic">
                                "In any number, at any place, the Place Value of 0 is ALWAYS 0 and Face Value of 0 is ALWAYS 0."
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl border-2 border-pink-100 overflow-hidden mb-8">
                            <h4 className="p-4 bg-pink-500 text-white font-black text-center">Master Conversion Table</h4>
                            <table className="w-full text-center text-xs font-bold">
                                <thead className="bg-pink-100">
                                    <tr><th className="p-2 border">Indian System</th><th className="p-2 border">International</th><th className="p-2 border">Roman-ish</th></tr>
                                </thead>
                                <tbody>
                                    <tr><td className="p-2 border">1,00,000 (1 Lakh)</td><td className="p-2 border">100,000 (100 Thousand)</td><td className="p-2 border">---</td></tr>
                                    <tr className="bg-pink-50"><td className="p-2 border text-pink-700 font-black">10,00,000 (10 Lakh)</td><td className="p-2 border text-pink-700 font-black">1,000,000 (1 Million)</td><td className="p-2 border">---</td></tr>
                                    <tr><td className="p-2 border">1,00,00,000 (1 Crore)</td><td className="p-2 border">10,000,000 (10 Million)</td><td className="p-2 border">---</td></tr>
                                    <tr className="bg-pink-50"><td className="p-2 border">10,00,00,000 (10 Crore)</td><td className="p-2 border">100,000,000 (100 Million)</td><td className="p-2 border">---</td></tr>
                                </tbody>
                            </table>
                        </div>

                        <Exercise title="Exercise 4: Conversion Master" questions={[
                            "Place value of 5 in 1,25,000", "Face value of 9 in 9,87,654", "1 Million = [ ] Lakhs", "5 Crore = [ ] Million", "How many zeros in 10 Million?",
                            "Position of 8 in 48,00,000", "Place value of 0 in 506", "Diff of P.V and F.V of 2 in 125", "100 Lakh = [ ] Crore", "20 Million = [ ] Crore"
                        ]} />
                    </section>

                    {/* THINK AND TRY */}
                    <section className="bg-slate-900 text-white rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
                            <Trophy size={140} className="text-yellow-400 rotate-12" />
                        </div>
                        <div className="flex items-center gap-4 mb-10">
                            <div className="bg-yellow-400 text-slate-900 p-3 rounded-2xl">
                                <Lightbulb size={32} />
                            </div>
                            <div>
                                <h2 className="text-4xl font-black italic tracking-tighter">THINK AND TRY!</h2>
                                <p className="text-yellow-400 font-bold">Hard Candy Challenges</p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { t: "Logic", d: "Write a 9-digit number that remains the same even if written in reverse." },
                                { t: "Roman", d: "Is 'IL' a valid Roman Numeral for 49? Explain why (Hint: Rule 2 limits)." },
                                { t: "Money", d: "If you have 1 Billion candies, how many Crores is that? (Hint: 1 Billion = 1000 Million)" },
                                { t: "Place", d: "Find a number where the Place value of 4 is 4,000 and Face value is 4." }
                            ].map((card, i) => (
                                <div key={i} className="bg-white/10 p-5 rounded-3xl border border-white/20 hover:bg-white/20 transition-all cursor-help group">
                                    <p className="text-xs font-black text-yellow-400 mb-2 uppercase tracking-widest">{card.t}</p>
                                    <p className="text-sm font-medium leading-relaxed group-hover:text-yellow-100">{card.d}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                </main>

                {/* FOOTER TRICKS */}
                <footer className="max-w-5xl mx-auto mt-20 bg-orange-100 p-8 rounded-[3rem] border-4 border-dashed border-orange-300">
                    <h4 className="text-2xl font-black text-orange-600 mb-4 flex items-center gap-2">
                        <Star size={24} fill="currentColor" /> Quick Tips & Tricks
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4 text-sm font-bold text-orange-800">
                        <div className="flex gap-2">🚀 <span>10 Lakhs = 1 Million (Just move the commas!)</span></div>
                        <div className="flex gap-2">🚀 <span>V, L, D are never subtracted or repeated!</span></div>
                        <div className="flex gap-2">🚀 <span>Place value = Digit times of Place.</span></div>
                        <div className="flex gap-2">🚀 <span>Comma trick: International is always "Three-Three-Three".</span></div>
                    </div>
                </footer>
                <div className="flex gap-4 justify-center mt-6">
                    {/* Print Button */}
                    <button
                        onClick={printPage}
                        className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-600 transition"
                    >
                        <Printer size={18} />
                        Print
                    </button>
                </div>
            </div>
        );
    };
};

export default Chapter1;


