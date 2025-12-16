import type { IComponent } from '@app-types/common';
import type { JSX } from 'react';
import { submitForm } from './actions';

interface IServerFormProps {
	test?: string;
}

/**
 * ServerApi FormData Example Page
 * serverApi를 사용하여 FormData를 전송하는 예제 페이지입니다.
 */
const ServerForm: IComponent<IServerFormProps> = async (): Promise<JSX.Element> => {
	return (
		<>
			<form action={submitForm as any}>
				<input
					type="text"
					name="id"
					placeholder="1"
					readOnly
					value="1"
					required
				/>
				<input
					type="text"
					name="title"
					placeholder="제목"
					required
				/>
				<input
					type="text"
					name="content"
					placeholder="내용"
					required
				/>
				<input
					type="text"
					name="UserId"
					placeholder="1"
					readOnly
					value="1"
					required
				/>
				<button type="submit">제출</button>
			</form>
		</>
	);
};

ServerForm.displayName = 'ServerForm';
export default ServerForm;
