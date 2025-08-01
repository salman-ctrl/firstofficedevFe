import React, { useEffect, useState } from 'react'
import Nav from '../components/Nav'
import { useNavigate, useParams } from 'react-router-dom'
import type { Office } from '../types/type'
import { z } from 'zod'
import axios from 'axios'
import { bookingSchema } from '../types/validationBooking'




const CheckBooking = () => {

    const { slug } = useParams<{ slug: string }>();
    const [office, setOffice] = useState<Office | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        phone_number: '',
        started_at: '',
        office_space_id: '',
        totalAmountWithUniqueCode: 0
    });

    const [formErrors, setFormErrors] = useState<z.ZodIssue[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [uniqueCode, setUniqueCode] = useState<number>(0);
    const [totalAmountWithUniqueCode, setTotalAmountWithUniqueCode] = useState<number>(0);

    useEffect(() => {
        console.log('fetching office data..');
        axios
            .get(`http://127.0.0.1:8000/api/office/${slug}`, {
                headers: {
                    "X-API-KEY": 'Qsqkj3kjnaso390293n923n',
                },
            })
            .then((response) => {
                console.log('office data fetched successfully:', response.data.data);

                setOffice(response.data.data);

                const officeSpaceId = response.data.data.id;
                const generateUniqueCode = Math.floor(100 + Math.random() * 900000);
                const grandTotal = response.data.data.price - generateUniqueCode;

                setUniqueCode(generateUniqueCode);
                setTotalAmountWithUniqueCode(grandTotal);

                setFormData((prevData) => ({
                    ...prevData,
                    office_space_id: officeSpaceId,
                    total_amount: grandTotal,
                }));
                setLoading(false)
            })
            .catch((error: unknown) => {
                if (axios.isAxiosError(error)) {
                    console.error('error fetching office data:', error.message)
                    setError(error.message);
                } else {
                    console.error('Unexpected error:', error);
                    setError('An unexpected error occured');
                }
                setLoading(false);
            });

    }, [slug]);

    const baseUrl = "http://127.0.0.1:8000/storage";

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        console.log("validation form data..");
        const validation = bookingSchema.safeParse(formData);
        if (!validation.success) {
            console.error('validation errors:', validation.error.issues);
            setFormErrors(validation.error.issues);
            return;
        }
        console.log('Form data is valid. submitting..', formData);
        setIsLoading(true);

        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/api/booking-transaction", {
                ...formData,
            },
                {
                    headers: {
                        'X-API-KEY': 'Qsqkj3kjnaso390293n923n',
                    },
                }
            );
            console.log('form submited succesfully:', response.data);

            navigate('success-booking', {
                state: {
                    office,
                    booking: response.data,
                },
            });
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                console.error('Error submiting form:', error.message);
                setError(error.message);
            } else {
                console.error('unpexcted error:', error);
                setError('An unexpected error occured');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Nav />
            <div
                id="Banner"
                className="relative w-full h-[240px] flex items-center shrink-0 overflow-hidden -mb-[50px]"
            >
                <h1 className="text-center mx-auto font-extrabold text-[40px] leading-[60px] text-white mb-5 z-20">
                    Start Booking Your Office
                </h1>
                <div className="absolute w-full h-full bg-[linear-gradient(180deg,_rgba(0,0,0,0)_0%,#000000_91.83%)] z-10" />
                <img
                    src="/assets/images/thumbnails/thumbnail-details-4.png"
                    className="absolute w-full h-full object-cover object-top"
                    alt=""
                />
            </div>
            <form
                action="booking-finished.html"
                className="relative flex justify-center max-w-[1130px] mx-auto gap-[30px] mb-20 z-20"
            >
                <div className="flex flex-col shrink-0 w-[500px] h-fit rounded-[20px] border border-[#E0DEF7] p-[30px] gap-[30px] bg-white">
                    <div className="flex items-center gap-4">
                        <div className="flex shrink-0 w-[140px] h-[100px] rounded-[20px] overflow-hidden">
                            <img
                                src={`${baseUrl}/${office?.thumbnail}`}
                                className="w-full h-full object-cover"
                                alt="thumbnail"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className="font-bold text-xl leading-[30px]">
                                {office?.name}
                            </p>
                            <div className="flex items-center gap-[6px]">
                                <img
                                    src="/assets/images/icons/location.svg"
                                    className="w-6 h-6"
                                    alt="icon"
                                />
                                <p className="font-semibold">{office?.city.name}</p>
                            </div>
                        </div>
                    </div>
                    <hr className="border-[#F6F5FD]" />
                    <div className="flex flex-col gap-4">
                        <h2 className="font-bold">Complete The Details</h2>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="name" className="font-semibold">
                                Full Name
                            </label>
                            <div className="flex items-center rounded-full border border-[#000929] px-5 gap-[10px] transition-all duration-300 focus-within:ring-2 focus-within:ring-[#0D903A]">
                                <img
                                    src="/assets/images/icons/security-user-black.svg"
                                    className="w-6 h-6"
                                    alt="icon"
                                />
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    onChange={handleChange}
                                    value={formData.name}
                                    className="appearance-none outline-none w-full py-3 font-semibold placeholder:font-normal placeholder:text-[#000929]"
                                    placeholder="Write your complete name"
                                />
                                {formErrors.find((error) => error.path.includes('name')) && (<p className='text-red-500'>Name is required</p>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="phone" className="font-semibold">
                                Phone Number
                            </label>
                            <div className="flex items-center rounded-full border border-[#000929] px-5 gap-[10px] transition-all duration-300 focus-within:ring-2 focus-within:ring-[#0D903A]">
                                <img
                                    src="/assets/images/icons/call-black.svg"
                                    className="w-6 h-6"
                                    alt="icon"
                                />
                                <input
                                    type="tel"
                                    name="phone_number"
                                    id="phone"
                                    onChange={handleChange}
                                    value={formData.phone_number}
                                    className="appearance-none outline-none w-full py-3 font-semibold placeholder:font-normal placeholder:text-[#000929]"
                                    placeholder="Write your valid number"
                                />
                                {formErrors.find((error) => error.path.includes('phone_number')) && (<p className='text-red-500'>Name is required</p>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="date" className="font-semibold">
                                Started At
                            </label>
                            <div className="flex items-center rounded-full border border-[#000929] px-5 gap-[10px] transition-all duration-300 focus-within:ring-2 focus-within:ring-[#0D903A] overflow-hidden">
                                <img
                                    src="/assets/images/icons/calendar-black.svg"
                                    className="w-6 h-6"
                                    alt="icon"
                                />
                                <input
                                    type="date"
                                    name="started_at" value={formData.started_at}
                                    onChange={handleChange}
                                    id="date"
                                    className="relative appearance-none outline-none w-full py-3 font-semibold [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:opacity-0"
                                />
                                {formErrors.find((error) => error.path.includes('started_at')) && (<p className='text-red-500'>Name is required</p>
                                )}
                            </div>
                        </div>
                    </div>
                    <hr className="border-[#F6F5FD]" />
                    <div className="flex items-center gap-3">
                        <img
                            src="/assets/images/icons/shield-tick.svg"
                            className="w-[30px] h-[30px]"
                            alt="icon"
                        />
                        <p className="font-semibold leading-[28px]">
                            Kami akan melindungi privasi Anda sebaik mungkin sehingga dapat fokus
                            bekerja
                        </p>
                    </div>
                    <hr className="border-[#F6F5FD]" />
                    <div className="flex flex-col gap-[30px]">
                        <h2 className="font-bold">Bonus Packages For You</h2>
                        <div className="grid grid-cols-2 gap-[30px]">
                            <div className="flex items-center gap-4">
                                <img
                                    src="/assets/images/icons/coffee.svg"
                                    className="w-[34px] h-[34px]"
                                    alt="icon"
                                />
                                <div className="flex flex-col gap-[2px]">
                                    <p className="font-bold text-lg leading-[24px]">Extra Snacks</p>
                                    <p className="text-sm leading-[21px]">Work-Life Balance</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <img
                                    src="/assets/images/icons/group.svg"
                                    className="w-[34px] h-[34px]"
                                    alt="icon"
                                />
                                <div className="flex flex-col gap-[2px]">
                                    <p className="font-bold text-lg leading-[24px]">Free Move</p>
                                    <p className="text-sm leading-[21px]">Anytime 24/7</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col shrink-0 w-[400px] h-fit rounded-[20px] border border-[#E0DEF7] p-[30px] gap-[30px] bg-white">
                    <h2 className="font-bold">Your Order Details</h2>
                    <div className="flex flex-col gap-5">
                        <div className="flex items-center justify-between">
                            <p className="font-semibold">Duration</p>
                            <p className="font-bold">{office?.duration} Days Working</p>
                        </div>
                        <div className="flex items-center justify-between">
                            <p className="font-semibold">Sub Total</p>
                            <p className="font-bold">Rp {office?.price.toLocaleString('id')}</p>
                        </div>
                        <div className="flex items-center justify-between">
                            <p className="font-semibold">Unique Code</p>
                            <p className="font-bold text-[#FF2D2D]">-Rp {uniqueCode?.toLocaleString('id')}</p>
                        </div>
                        <div className="flex items-center justify-between">
                            <p className="font-semibold">Grand Total</p>
                            <p className="font-bold text-[22px] leading-[33px] text-[#0D903A]">
                                {totalAmountWithUniqueCode.toLocaleString('id', {
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0,
                                })}

                            </p>
                        </div>
                        <div className="relative rounded-xl p-[10px_20px] gap-[10px] bg-[#000929] text-white">
                            <img
                                src="/assets/images/icons/Polygon 1.svg"
                                className="absolute -top-[15px] right-[10px] "
                                alt=""
                            />
                            <p className="font-semibold text-sm leading-[24px] z-10">
                                Tolong perhatikan kode unik berikut ketika melakukan pembayaran
                                kantor
                            </p>
                        </div>
                    </div>
                    <hr className="border-[#F6F5FD]" />
                    <h2 className="font-bold">Send Payment to</h2>
                    <div className="flex flex-col gap-[30px]">
                        <div className="flex items-center gap-3">
                            <div className="w-[71px] flex shrink-0">
                                <img
                                    src="/assets/images/logos/bca.svg"
                                    className="w-full object-contain"
                                    alt="bank logo"
                                />
                            </div>
                            <div className="flex flex-col gap-[2px]">
                                <div className="flex items-center gap-1">
                                    <p className="font-semibold">FirstOffice Angga</p>
                                    <img
                                        src="/assets/images/icons/verify.svg"
                                        className="w-[18px] h-[18px]"
                                        alt="icon"
                                    />
                                </div>
                                <p>8008129839</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-[71px] flex shrink-0">
                                <img
                                    src="/assets/images/logos/mandiri.svg"
                                    className="w-full object-contain"
                                    alt="bank logo"
                                />
                            </div>
                            <div className="flex flex-col gap-[2px]">
                                <div className="flex items-center gap-1">
                                    <p className="font-semibold">FirstOffice Angga</p>
                                    <img
                                        src="/assets/images/icons/verify.svg"
                                        className="w-[18px] h-[18px]"
                                        alt="icon"
                                    />
                                </div>
                                <p>12379834983281</p>
                            </div>
                        </div>
                    </div>
                    <hr className="border-[#F6F5FD]" />
                    <button
                        type="submit"
                        onSubmit={handleSubmit}
                        disabled={isLoading}

                        className="flex items-center justify-center w-full rounded-full p-[16px_26px] gap-3 bg-[#0D903A] font-bold text-[#F7F7FD]"
                    >
                        <span>{isLoading ? "loading" : "i've already paid"}</span>
                    </button>
                </div>
            </form>
        </>

    )
}

export default CheckBooking
