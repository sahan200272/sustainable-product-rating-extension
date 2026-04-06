import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { generateEducationGuide, getPublicBlogById } from "../../services/blogService";

export default function EducationHubPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [blog, setBlog] = useState(null);
    const [guide, setGuide] = useState(null);
    const [loading, setLoading] = useState(true);
    const [generatingMoreQuiz, setGeneratingMoreQuiz] = useState(false);
    const [quizFinished, setQuizFinished] = useState(false);

    const [quizIndex, setQuizIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});

    const currentQuiz = guide?.quiz?.[quizIndex] || null;
    const totalQuizCount = guide?.quiz?.length || 0;
    const isLastQuestion = totalQuizCount > 0 && quizIndex === totalQuizCount - 1;
    const answeredCount = useMemo(() => {
        if (!totalQuizCount) return 0;
        return Array.from({ length: totalQuizCount }).filter((_, index) => selectedAnswers[index] !== undefined).length;
    }, [selectedAnswers, totalQuizCount]);

    const score = useMemo(() => {
        if (!Array.isArray(guide?.quiz)) return 0;
        return guide.quiz.reduce((acc, question, index) => {
            return selectedAnswers[index] === question.correctAnswer ? acc + 1 : acc;
        }, 0);
    }, [guide, selectedAnswers]);

    const scorePercent = totalQuizCount ? Math.round((score / totalQuizCount) * 100) : 0;

    const currentSelectedAnswer = selectedAnswers[quizIndex];
    const isCurrentAnswerCorrect =
        currentQuiz && currentSelectedAnswer !== undefined
            ? currentSelectedAnswer === currentQuiz.correctAnswer
            : false;

    useEffect(() => {
        const loadEducationHubData = async () => {
            try {
                const blogData = await getPublicBlogById(id);
                const blogInfo = blogData?.blog;

                if (!blogInfo) {
                    toast.error("Blog not found");
                    navigate("/blogs");
                    return;
                }

                setBlog(blogInfo);

                const cacheKey = `education-guide-${id}`;
                const cachedGuide = sessionStorage.getItem(cacheKey);

                if (cachedGuide) {
                    try {
                        const parsed = JSON.parse(cachedGuide);
                        setGuide(parsed);
                        setLoading(false);
                        return;
                    } catch {
                        sessionStorage.removeItem(cacheKey);
                    }
                }

                const response = await generateEducationGuide({
                    title: blogInfo.title,
                    content: blogInfo.content,
                });

                const educationGuide = response?.educationGuide || null;
                setGuide(educationGuide);
                if (educationGuide) {
                    sessionStorage.setItem(cacheKey, JSON.stringify(educationGuide));
                }
            } catch (error) {
                toast.error(error?.response?.data?.error || "Failed to load education hub");
                navigate(`/blogs/${id}`);
            } finally {
                setLoading(false);
            }
        };

        loadEducationHubData();
    }, [id, navigate]);

    const handleSelectAnswer = (questionIdx, optionIdx) => {
        setSelectedAnswers((prev) => ({
            ...prev,
            [questionIdx]: optionIdx,
        }));
    };

    const toggleTip = (tip) => {
        setSelectedAnswers((prev) => {
            const checkedTips = Array.isArray(prev.__tips) ? prev.__tips : [];
            const exists = checkedTips.includes(tip);

            return {
                ...prev,
                __tips: exists ? checkedTips.filter((item) => item !== tip) : [...checkedTips, tip],
            };
        });
    };

    const checkedTips = Array.isArray(selectedAnswers.__tips) ? selectedAnswers.__tips : [];

    const handleFinishQuiz = () => {
        setQuizFinished(true);

        if (answeredCount < totalQuizCount) {
            toast.success(`Current score: ${score}/${totalQuizCount} (${scorePercent}%). You can answer remaining questions too.`);
            return;
        }

        toast.success(`Quiz finished! Final score: ${score}/${totalQuizCount} (${scorePercent}%)`);
    };

    const handleRetryQuiz = () => {
        setQuizIndex(0);
        setQuizFinished(false);
        setSelectedAnswers((prev) => ({
            __tips: Array.isArray(prev.__tips) ? prev.__tips : [],
        }));
        toast.success("Quiz reset. Try again!");
    };

    const handleGenerateMoreQuiz = async () => {
        if (!blog) return;

        try {
            setGeneratingMoreQuiz(true);

            const response = await generateEducationGuide({
                title: blog.title,
                content: blog.content,
            });

            const nextGuide = response?.educationGuide;
            const nextQuiz = nextGuide?.quiz;

            if (!Array.isArray(nextQuiz) || nextQuiz.length === 0) {
                toast.error("Could not generate more quiz right now");
                return;
            }

            setGuide((prev) => {
                if (!prev) return nextGuide;
                const updated = {
                    ...prev,
                    quiz: nextQuiz,
                };
                sessionStorage.setItem(`education-guide-${id}`, JSON.stringify(updated));
                return updated;
            });

            setQuizIndex(0);
            setQuizFinished(false);
            setSelectedAnswers((prev) => ({
                __tips: Array.isArray(prev.__tips) ? prev.__tips : [],
            }));
            toast.success("New quiz generated");
        } catch (error) {
            toast.error(error?.response?.data?.error || "Failed to generate more quiz");
        } finally {
            setGeneratingMoreQuiz(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 p-4 sm:p-6">
                <div className="mx-auto max-w-7xl rounded-3xl border border-green-100 bg-white p-8 text-center shadow-sm">
                    Generating Education Hub...
                </div>
            </div>
        );
    }

    if (!guide || !blog) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 p-4 sm:p-6">
                <div className="mx-auto max-w-7xl rounded-3xl border border-green-100 bg-white p-8 text-center shadow-sm">
                    Unable to load education content.
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-100 p-3 sm:p-6">
            <div className="mx-auto max-w-7xl rounded-3xl border border-emerald-100 bg-emerald-50/70 shadow-lg backdrop-blur-sm">
                <header className="flex items-center justify-between border-b border-emerald-100 bg-white/70 px-5 py-4 sm:px-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Education Hub</h1>
                        <p className="mt-1 text-sm text-gray-600 truncate max-w-[260px] sm:max-w-none">
                            {blog.title}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link
                            to={`/blogs/${id}`}
                            className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-emerald-700 shadow hover:bg-emerald-50"
                        >
                            Back to Blog
                        </Link>
                    </div>
                </header>

                <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 xl:grid-cols-3">
                    <section className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
                        <h2 className="text-3xl font-bold text-gray-900">Summary</h2>
                        <p className="mt-4 whitespace-pre-line text-sm leading-7 text-gray-700">
                            {guide.summary}
                        </p>
                    </section>

                    <section className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
                        <h2 className="text-3xl font-bold text-gray-900">Key Points</h2>
                        <ul className="mt-4 list-disc space-y-3 pl-5 text-sm leading-6 text-gray-700">
                            {guide.keyPoints?.map((point, idx) => (
                                <li key={`${point}-${idx}`}>{point}</li>
                            ))}
                        </ul>
                    </section>

                    <section className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
                        <h2 className="text-3xl font-bold text-gray-900">Glossary Terms</h2>
                        <div className="mt-4 space-y-3">
                            {guide.glossary?.map((item, idx) => (
                                <div key={`${item.term}-${idx}`} className="flex items-start gap-3">
                                    <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 font-bold text-emerald-700">
                                        {item.term?.slice(0, 2)?.toUpperCase() || "AI"}
                                    </span>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">{item.term}</p>
                                        <p className="text-xs leading-5 text-gray-600">{item.definition}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <h2 className="text-3xl font-bold text-gray-900">Interactive Quiz</h2>
                            <button
                                type="button"
                                onClick={handleGenerateMoreQuiz}
                                disabled={generatingMoreQuiz}
                                className="rounded-lg bg-emerald-100 px-3 py-2 text-xs font-bold text-emerald-800 hover:bg-emerald-200 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {generatingMoreQuiz ? "Generating..." : "Generate More Quiz"}
                            </button>
                        </div>

                        <div className="mt-3 rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2">
                            <p className="text-sm font-semibold text-emerald-900">
                                Quiz Score: {score}/{totalQuizCount} ({scorePercent}%)
                            </p>
                            <p className="text-xs text-emerald-800">
                                Answered: {answeredCount}/{totalQuizCount}
                                {answeredCount === totalQuizCount
                                    ? scorePercent >= 70
                                        ? " • Great job!"
                                        : " • Try one more quiz to improve"
                                    : " • Complete all questions to finalize score"}
                            </p>
                        </div>

                        {quizFinished ? (
                            <div className="mt-3 rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-2">
                                <p className="text-sm font-semibold text-indigo-900">
                                    Final Score: {score}/{totalQuizCount} ({scorePercent}%)
                                </p>
                                <p className="text-xs text-indigo-700">
                                    {scorePercent >= 70 ? "Great work!" : "Keep practicing and try Generate More Quiz."}
                                </p>
                                <button
                                    type="button"
                                    onClick={handleRetryQuiz}
                                    className="mt-2 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700"
                                >
                                    Retry Quiz
                                </button>
                            </div>
                        ) : null}

                        {currentQuiz ? (
                            <div className="mt-4">
                                <p className="text-sm font-semibold text-gray-800">
                                    Q{quizIndex + 1}. {currentQuiz.question}
                                </p>

                                <div className="mt-4 space-y-2">
                                    {currentQuiz.options?.map((option, optionIdx) => {
                                        const selected = selectedAnswers[quizIndex] === optionIdx;
                                        return (
                                            <label
                                                key={`${option}-${optionIdx}`}
                                                className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition ${
                                                    selected
                                                        ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                                                        : "border-gray-200 hover:bg-gray-50"
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name={`quiz-${quizIndex}`}
                                                    checked={selected}
                                                    onChange={() => handleSelectAnswer(quizIndex, optionIdx)}
                                                    className="h-4 w-4 accent-emerald-600"
                                                />
                                                {option}
                                            </label>
                                        );
                                    })}
                                </div>

                                <div className="mt-5 flex items-center justify-between">
                                    <button
                                        type="button"
                                        onClick={() => setQuizIndex((prev) => Math.max(0, prev - 1))}
                                        disabled={quizIndex === 0}
                                        className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        Prev
                                    </button>

                                    <span className="text-xs font-semibold text-gray-600">
                                        Score: {score}/{guide.quiz?.length || 0}
                                    </span>

                                    {isLastQuestion ? (
                                        <button
                                            type="button"
                                            onClick={handleFinishQuiz}
                                            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                                        >
                                            {quizFinished ? "Finished" : "Finish Quiz"}
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setQuizIndex((prev) =>
                                                    Math.min((guide.quiz?.length || 1) - 1, prev + 1)
                                                )
                                            }
                                            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                                        >
                                            Next →
                                        </button>
                                    )}
                                </div>

                                {selectedAnswers[quizIndex] !== undefined ? (
                                    isCurrentAnswerCorrect ? (
                                        <p className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
                                            ✅ Correct answer.
                                            {currentQuiz.explanation ? ` ${currentQuiz.explanation}` : ""}
                                        </p>
                                    ) : (
                                        <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-800">
                                            ❌ Wrong answer. Correct answer: {currentQuiz.options?.[currentQuiz.correctAnswer]}
                                            {currentQuiz.explanation ? ` — ${currentQuiz.explanation}` : ""}
                                        </p>
                                    )
                                ) : null}
                            </div>
                        ) : (
                            <p className="mt-4 text-sm text-gray-600">Quiz is unavailable.</p>
                        )}
                    </section>

                    <section className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
                        <h2 className="text-3xl font-bold text-gray-900">Actionable Tips</h2>
                        <div className="mt-4 space-y-2">
                            {guide.actionableTips?.map((tip, idx) => {
                                const checked = checkedTips.includes(tip);
                                return (
                                    <label
                                        key={`${tip}-${idx}`}
                                        className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1 text-sm text-gray-700 hover:bg-emerald-50"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={checked}
                                            onChange={() => toggleTip(tip)}
                                            className="h-4 w-4 accent-emerald-600"
                                        />
                                        {tip}
                                    </label>
                                );
                            })}
                        </div>
                    </section>

                    <section className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
                        <h2 className="text-3xl font-bold text-gray-900">SDG-12 Connection</h2>
                        <div className="mt-4 flex items-start gap-3">
                            <div className="rounded-lg bg-amber-200 px-3 py-2 text-xs font-black text-amber-900">
                                12
                            </div>
                            <p className="text-sm leading-6 text-gray-700">{guide.sdg12Connection}</p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
