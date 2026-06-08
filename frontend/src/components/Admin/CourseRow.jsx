import React  from "react"
import { Link } from "react-router-dom"

const CourseRow = ({course,onDelete})=>{
  return (
    <tr key={course._id} className="border-b hover:bg-gray-50 cursor-pointer">
      <td className="p-4 font-medium text-gray-900 whitespace-nowrap">{course.name}</td>
      <td className="p-4">{course.section?.name || course.section || '-'}</td>
      <td className="p-4">{course.domain?.name || course.domain || '-'}</td>
      <td className="p-4">{course.price}</td>
      <td className="p-4">
        <Link to={`/admin/courses/${course._id}/edit`} className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600">Edit</Link>
        <button onClick={() => onDelete(course._id)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">Delete</button>
      </td>
    </tr>
  );
};

export default CourseRow;