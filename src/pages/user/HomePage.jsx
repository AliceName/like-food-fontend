import { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import Card from '../../components/Card'
import { supabase } from '../../supabaseClient'
import Loading from '../../components/Loading';

function HomePage() {

    const { handleBuy } = useOutletContext();
    const [listProducts, setListProducts] = useState([]);

    useEffect(() => {
        const getListProduct = async () => {
            try {
                const { data, error } = await supabase
                    .from('products')
                    .select('*');

                if (error) {
                    console.log("Lỗi:", error);
                } else {
                    setListProducts(data);
                }
            } catch (error) {
                console.log("Lỗi kết nối:", error.message);
            }
        };
        getListProduct();
    }, []);

    return (
        <>
            <div>
                {/* Loading.... */}
                {listProducts.length === 0 ? (
                    <Loading text="Đang tải dữ liệu món ăn..." />
                ) : (
                    <div className='product-container'>
                        {listProducts.map((food) => (
                            <Card
                                key={food.id}
                                id={food.id}
                                linkAnh={food.anh}
                                nameProduct={food.ten}
                                price={food.gia}
                                handleMua={() => handleBuy(food)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    )
}
export default HomePage;