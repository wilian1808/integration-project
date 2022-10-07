import { NextResponse } from 'next/server'

const routes = [
  { pathname: '/profile', protected: true }
]

export default async function middleware (request) {
  // obtenemos el path del request
  const pathname = request.nextUrl.pathname
  // obtenemos la cookie
  const authCookie = await request.cookies.get('sb-access-token')
  // si existe un usuario se bloquean algunas paginas
  if (pathname === '/login' || pathname === '/register' || pathname === '/') {
    if (authCookie) return NextResponse.redirect(new URL('/profile', request.url))
  }
  // si no existe un usuario redirigimos al login
  if (routes.some(item => item.pathname === pathname)) {
    if (!authCookie) return NextResponse.redirect(new URL('/login', request.url))
  }
  // si la ruta no es protegida continuamos normal
  return NextResponse.next()
}

// podemos definir solo que rutas seran evaluadas con el middleware
// export const config = {
//   matcher: [
//     '/profile',
//   ]
// }
