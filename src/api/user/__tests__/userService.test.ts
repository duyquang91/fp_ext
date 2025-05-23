// import { StatusCodes } from 'http-status-codes'
// import { Mock } from 'vitest'

// import { User } from '@/api/user/userModel'
// import { userRepository } from '@/api/user/userRepository'
// import { userService } from '@/api/user/userService'

// vi.mock('@/api/user/userRepository')
// vi.mock('@/server', () => ({
//   ...vi.importActual('@/server'),
//   logger: {
//     error: vi.fn(),
//   },
// }))

// describe('userService', () => {
//   const mockUsers: User[] = [
//     { name: 'Alice', email: 'alice@example.com', userId: '1', token: '', cookie: '' },
//     { name: 'Bob', email: 'bob@example.com', userId: '2', token: '', cookie: '' },
//   ]

//   describe('findAll', () => {
//     it('return all users', async () => {
//       // Arrange
//       ;(userRepository.findAllAsync as Mock).mockReturnValue(mockUsers)

//       // Act
//       const result = await userService.findAll()

//       // Assert
//       expect(result.statusCode).toEqual(StatusCodes.OK)
//       expect(result.success).toBeTruthy()
//       expect(result.message).toContain('Users found')
//       expect(result.responseObject).toEqual(mockUsers)
//     })

//     it('returns a not found error for no users found', async () => {
//       // Arrange
//       ;(userRepository.findAllAsync as Mock).mockReturnValue(null)

//       // Act
//       const result = await userService.findAll()

//       // Assert
//       expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND)
//       expect(result.success).toBeFalsy()
//       expect(result.message).toContain('No Users found')
//       expect(result.responseObject).toBeNull()
//     })

//     it('handles errors for findAllAsync', async () => {
//       // Arrange
//       ;(userRepository.findAllAsync as Mock).mockRejectedValue(new Error('Database error'))

//       // Act
//       const result = await userService.findAll()

//       // Assert
//       expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR)
//       expect(result.success).toBeFalsy()
//       expect(result.message).toContain('Error finding all users')
//       expect(result.responseObject).toBeNull()
//     })
//   })

//   describe('findById', () => {
//     it('returns a user for a valid ID', async () => {
//       // Arrange
//       const testId = 1
//       const mockUser = mockUsers.find((user) => user.userId === '${testId}')
//       ;(userRepository.findByUserId as Mock).mockReturnValue(mockUser)

//       // Act
//       const result = await userService.findByUserId('${testId}')

//       // Assert
//       expect(result.statusCode).toEqual(StatusCodes.OK)
//       expect(result.success).toBeTruthy()
//       expect(result.message).toContain('User found')
//       expect(result.responseObject).toEqual(mockUser)
//     })

//     it('handles errors for findByIdAsync', async () => {
//       // Arrange
//       const testId = 1
//       ;(userRepository.findByUserId as Mock).mockRejectedValue(new Error('Database error'))

//       // Act
//       const result = await userService.findByUserId(testId)

//       // Assert
//       expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR)
//       expect(result.success).toBeFalsy()
//       expect(result.message).toContain(`Error finding user with id ${testId}`)
//       expect(result.responseObject).toBeNull()
//     })

//     it('returns a not found error for non-existent ID', async () => {
//       // Arrange
//       const testId = 1
//       ;(userRepository.findByUserId as Mock).mockReturnValue(null)

//       // Act
//       const result = await userService.findByUserId(testId)

//       // Assert
//       expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND)
//       expect(result.success).toBeFalsy()
//       expect(result.message).toContain('User not found')
//       expect(result.responseObject).toBeNull()
//     })
//   })
// })
