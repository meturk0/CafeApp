import { useCart } from '../context/CartContext';

export const useAddToCart = () => {
    const { cart, setCart } = useCart();

    const addToCart = (product) => {
        setCart(prevCart => {
            const found = prevCart.find(item => item.id === product.id);
            if (found) {
                return prevCart.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                return [...prevCart, { ...product, quantity: 1 }];
            }
        });
    };

    const addToCartMany = (products) => {
        setCart(prevCart => {
            let updatedCart = [...prevCart];
            products.forEach(product => {
                const found = updatedCart.find(item => item.id === product.id);
                if (found) {
                    updatedCart = updatedCart.map(item =>
                        item.id === product.id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    );
                } else {
                    updatedCart.push({ ...product, quantity: 1 });
                }
            });
            return updatedCart;
        });
    };

    return { addToCart, addToCartMany };
}; 