"use client"
import axios from "axios";
import { useMemo, useEffect, useState } from 'react';
import Spinner from "@/components/Element/Spinner";
import TableApp from "./tableUsers";
import { FormProvider, useForm } from 'react-hook-form'
import FormField from '@/components/Element/FormField';
import JsCookie from 'js-cookie';

const SendMessages = ({ nextStep }: any) => {

    const methods = useForm();
    let { handleSubmit, reset } = methods;
    let id: any = useMemo(() => localStorage.getItem("course"), [])
    let [users, setUser] = useState([])
    let [usersEnd, setUserEnd] = useState([])
    let [course, setCourse] = useState([])
    let token = JsCookie.get("authorization")

    let headers = { Authorization: `Bearer ${token}` }

    useEffect(() => {
        // افترض أنك تستدعي API للحصول على بيانات المستخدم
        id && axios.get(`${process.env.NEXT_PUBLIC_API}/admin/users-details/filterByCourse/${id}`, { headers })
            .then(({ data }) => {
                setUser(data.users)
                setCourse(data.course)
            })
            .catch(error => console.error('Error fetching user data:', error));

    }, [id])


    const onSubmit = async (res: any) => {
        let init = {
            url: id,
            list: usersEnd.map((a: any) => a._id),
            msg: res.msg
        }
        try {
            const url = `${process.env.NEXT_PUBLIC_API}/admin/wa`;
            const { data } = await axios.post(url, init, { headers });
            // await axios.post(url, data, headers);
            // nextStep();
        } catch (error) {
            console.error('Error adding course:', error);
        }
    };

    return (
        <div className="w-full flex flex-col md:flex-row mx-auto p-4 rtl text-slate-900  justify-center  ">
            <div className="max-w-[500px] w-full">
                <OneCourse data={course} />

                <FormProvider {...methods}>
                    <div className="w-full flex flex-col items-center max-w-md mx-auto p-4 rtl text-slate-900">
                        <hr className="border-b-2 w-full mb-4" />
                        <form className="space-y-4 md:space-y-6 w-full" onSubmit={handleSubmit(onSubmit)}>
                            <h2 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ddark:text-white text-center">
                                انشاء نص الرسالة
                            </h2>

                            <FormField
                                label="نص الرسالة"
                                name="msg"
                                as="textarea"
                                rows="8"
                                placeholder="أدخل نص الرسالة"
                                defaultValue={msg}
                                validation={{ required: 'وصف الدورة مطلوب' }}
                            />

                            <div className="flex space-x-4">
                                <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ddark:bg-primary-600 ddark:hover:bg-primary-700 ddark:focus:ring-primary-800" >
                                    إضافة الدورة
                                </button>
                            </div>
                        </form>
                    </div>
                </FormProvider>
            </div>
            <div className="w-full ">
                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ddark:text-white text-center">
                    اختيار الطلاب
                </h1>
                <div className="my-4"> </div>
                <TableApp data={users} set={setUserEnd} />
            </div>
        </div>
    );
};

export default SendMessages;

export function OneCourse({ data }: any) {
    if (!data) return <Spinner />
    let { title, location, image } = data;
    return (
        <div className="bg-white flex rounded-lg">
            <div className="bg-white rounded-lg md:px-6 md:mx-4 w-full flex flex-col    justify-start">
                {image?.length > 1
                    ? <img loading='lazy' className=" m-auto w-auto rounded-lg md:max-h-[300px] md:w-fit md:my-4" src={image} alt={title} />
                    : <div className='min-h-[220px] min-w-[300px] bg-gray-200 rounded-md flex justify-center items-center text-gray-500'>لا يوجد صورة</div>}
                <div className="flex flex-col m-4">
                    <h2 className="text-2xl font-bold mb-4 lg:max-w-[350px] flex justify-center items-center text-gray-500 ">{title}</h2>
                    <div className="  *:my-4">
                        <p>{location}</p>
                    </div>
                </div>
            </div>
            <hr />
        </div >
    );
}
let msg = `
مرحبا {{name}} كيف حالك 
نحن منصة تلاقي، سجلتم لدينا سابقاً للبحث عن تدريبات تناسبكم.
تتوفر حالياً هذه الدورة {{title}} التي قد تهمكم، ويمكنكم الاطلاع على التفاصيل والتسجيل عبر الرابط:
> رابط الدورة:
https://talaqi.vercel.app/courses/{{_id}}
`